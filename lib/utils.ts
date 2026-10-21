export function getTripStatusLabel(status: string) {
  switch (status) {
    case "ongoing": return "Ongoing";
    case "closed": return "Trip Closed (Claim Pending)";
    case "claimed": return "Claim Submitted / Settled";
    default: return status;
  }
}