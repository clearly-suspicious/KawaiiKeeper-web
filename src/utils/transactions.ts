const pricing: { [index: string]: number } = {
  IMG2IMG: 10,
  TXT2IMG: 1,
  CHATBOT: 1,
};

export function checkEligibility(type: string, userTokens: number) {
  const cost = pricing[type];
  if (cost) {
    if (userTokens < cost) return false;
    return true;
  } else {
    console.error(`No pricing found for ${type}`);
    return false;
  }
}
