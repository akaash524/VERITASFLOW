export async function initiateWorkflow(transaction) {
    if(transaction.riskLevel === "LOW") {
        transaction.status = "successful"
        transaction.currentApprovalLevel = 0
    }
    if(transaction.riskLevel === "MEDIUM") {
        transaction.currentApprovalLevel = 1
    }
    if(transaction.riskLevel === "HIGH") {
        transaction.currentApprovalLevel = 1
    }
    await transaction.save()
    return transaction
}

