from typing import Dict, List, Optional

class HealthAnalyzer:
    @staticmethod
    def analyze_daily_metrics(metrics: Dict) -> Dict:
        health_score = HealthAnalyzer._calculate_health_score(metrics)
        risk_level = HealthAnalyzer._assess_risk_level(health_score)
        return {
            "health_score": health_score,
            "risk_level": risk_level,
            "summary": HealthAnalyzer._generate_summary(health_score, risk_level),
        }

    @staticmethod
    def _calculate_health_score(metrics: Dict) -> float:
        score = 100
        if metrics.get('steps'):
            if metrics['steps'] < 5000:
                score -= 20
            elif metrics['steps'] < 8000:
                score -= 10
        return max(0, min(100, score))

    @staticmethod
    def _assess_risk_level(score: float) -> str:
        if score >= 80:
            return "low"
        elif score >= 60:
            return "medium"
        elif score >= 40:
            return "high"
        else:
            return "critical"

    @staticmethod
    def _generate_summary(score: float, risk_level: str) -> str:
        summaries = {
            "low": "您的健康状态良好，请继续保持良好的生活习惯。",
            "medium": "您的健康状态一般，建议改进饮食和运动习惯。",
            "high": "您的健康状态需要改善，建议增加运动和调整作息。",
            "critical": "您的健康状态需要立即改善，建议就医咨询。"
        }
        return summaries.get(risk_level, "无法评估健康状态")
