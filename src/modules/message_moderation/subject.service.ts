import Openai from "openai";

const FORBIDDEN_SUBJECTS: string[] = (process.env.FORBIDDEN_SUBJECTS ?? "").split(",").map((s) => `"${s.trim()}"`);

const openai: Openai = new Openai({
    apiKey: process.env.OPENAI_API_TOKEN,
});

export const hasForbiddenSubject = async (message: string): Promise<boolean> => {
    const prompt = `Réponds uniquement avec "OUI" ou "NON".\nEst-ce que le message suivant parle d'un des sujets suivants : [${FORBIDDEN_SUBJECTS}]\n\n"${message}"`;

    let response;
    try {
        response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
        });
    } catch (error) {
        console.error(`Could not get OPENAI response:\n${error}`);
        return false;
    }

    const generatedText = response.choices[0]?.message.content || "";

    return generatedText.includes("OUI") && !generatedText.includes("NON");
};
