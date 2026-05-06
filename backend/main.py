import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EduPulse AI API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq Client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class StudentData(BaseModel):
    name: str = Field(..., example="John Doe")
    study_hours: float = Field(..., ge=0, le=168, description="Weekly study hours")
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    prev_grade: float = Field(..., ge=0, le=100, description="Previous exam grade")
    sleep_hours: float = Field(..., ge=0, le=24, description="Average daily sleep hours")
    stress_level: int = Field(..., ge=1, le=10, description="Self-reported stress level 1-10")

def calculate_heuristic_prediction(data: StudentData) -> float:
    """
    Calculates a heuristic prediction based on weighted academic metrics.
    No training involved, just standard educational correlations.
    """
    # Weights
    W_PREV = 0.50
    W_STUDY = 0.25
    W_ATTENDANCE = 0.15
    W_SLEEP = 0.10
    
    # Normalizing study hours (Assuming 40 hours is 'optimal' for max score contribution)
    study_score = min((data.study_hours / 40) * 100, 100)
    
    # Normalizing sleep (Assuming 8 hours is 'optimal')
    sleep_score = min((data.sleep_hours / 8) * 100, 100)
    
    prediction = (
        (data.prev_grade * W_PREV) +
        (study_score * W_STUDY) +
        (data.attendance * W_ATTENDANCE) +
        (sleep_score * W_SLEEP)
    )
    
    # Adjust for stress level (Negative impact)
    # Every point of stress above 5 reduces the score slightly
    if data.stress_level > 5:
        prediction -= (data.stress_level - 5) * 1.5
        
    return max(0, min(100, round(prediction, 2)))

@app.post("/predict")
async def predict_performance(data: StudentData):
    try:
        # 1. Calculate Prediction
        predicted_score = calculate_heuristic_prediction(data)
        
        # 2. Get LLM Strategy from Groq
        prompt = f"""
        You are a senior academic performance advisor. A student has provided their performance metrics.
        
        STUDENT METRICS:
        - Name: {data.name}
        - Weekly Study Hours: {data.study_hours}
        - Attendance: {data.attendance}%
        - Previous Grade: {data.prev_grade}%
        - Daily Sleep: {data.sleep_hours} hours
        - Stress Level: {data.stress_level}/10
        
        HEURISTIC PREDICTION:
        The estimated expected grade is: {predicted_score}%
        
        YOUR TASK:
        1. Analyze the correlation between their habits and the prediction.
        2. Provide a personalized 'Roadmap to Success' including:
           - Specific study strategies based on their hours.
           - Lifestyle adjustments (sleep, stress management).
           - A motivational closing.
        
        Format the response in clear Markdown with bold headers. Keep it professional, encouraging, and actionable.
        """
        
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful and professional academic advisor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        
        strategy = completion.choices[0].message.content
        
        return {
            "name": data.name,
            "predicted_score": predicted_score,
            "strategy": strategy,
            "metrics_summary": {
                "academic_standing": "Excellent" if predicted_score >= 85 else "Good" if predicted_score >= 70 else "Needs Improvement" if predicted_score >= 50 else "At Risk"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def health_check():
    return {"status": "online", "message": "EduPulse AI Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
