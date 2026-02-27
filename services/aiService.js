export async function getAIResponse(text) {
  try {
    const userMood = text.toLowerCase();

    // Logic para sa mas maraming emosyon
    if (userMood.includes("happy") || userMood.includes("good") || userMood.includes("great") || userMood.includes("excited")) {
      return "That's wonderful! Your positive energy is contagious. Keep shining! ✨";
    } 
    else if (userMood.includes("sad") || userMood.includes("bad") || userMood.includes("tired") || userMood.includes("lonely")) {
      return "I'm sorry you're feeling this way. Remember that it's okay to rest and take it slow today. 🌿";
    } 
    else if (userMood.includes("anxious") || userMood.includes("nervous") || userMood.includes("worried") || userMood.includes("stressed")) {
      return "Take a deep breath. Focus on what you can control right now. You've got this. 🧘‍♂️";
    } 
    else if (userMood.includes("angry") || userMood.includes("mad") || userMood.includes("frustrated") || userMood.includes("annoyed")) {
      return "It's okay to feel frustrated. Try to take a step back and let your mind cool down for a moment. 🌬️";
    } 
    else if (userMood.includes("grateful") || userMood.includes("blessed") || userMood.includes("thankful")) {
      return "Gratitude is a powerful thing! It's lovely to see you appreciating the good things. 🙏";
    } 
    else {
      // Default message kung hindi pasok sa mga keywords
      return "Thank you for sharing your thoughts. I'm here to listen and support you. Remember to breathe and take things one step at a time.";
    }
  } catch (err) {
    return "AI service unavailable. Please take care of yourself.";
  }
}