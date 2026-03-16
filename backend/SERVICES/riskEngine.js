import { RulesModel } from "../MODELS/rulesModel.js"


function evaluateCondition(condition, transaction){
    const { field, operator, value } = condition
    const actual = transaction[field]

    switch(operator){
        case "GT": return actual > value
        case "LT": return actual < value
        case "EQ": return actual === value
        case "IN": return value.includes(actual)
        default: return false
    }
}
function classifyRisk(score){
    if(score <= 30) return "LOW"
    if(score <= 60) return "MEDIUM"
    return "HIGH"
}
export async function evaluateRisk(transaction) {
    // 1. fetch all active rules
    let rules = await RulesModel.find({ isActive: true })
    
    // 2. accumulate score and reasons
    let score = 0
    let reasons = []

    // 3. loop and evaluate
    for(let rule of rules) {
        let passed = evaluateCondition(rule.condition, transaction)
        if(passed) {
            score += rule.score
            reasons.push(rule.reason)
        }
    }

    // 4. classify
    let level = classifyRisk(score)

    // 5. return verdict only
    return { score, level, reasons }
}