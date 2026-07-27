import { ApproachGroup } from "../models/approachGroup.model.js";
import { Question } from "../models/question.model.js";

export const selectPracticeSet = async (sheet) => {
    const allGroups = await ApproachGroup.find({});

    const shuffledGroups = [...allGroups].sort(() => Math.random() - 0.5);
    const pickedGroups = shuffledGroups.slice(0, sheet.slotCount);

    const selectedQuestions = [];
    const usedQuestionIds = new Set();

    for (const group of pickedGroups) {
        const randomTag = group.tags[Math.floor(Math.random() * group.tags.length)];

        const matchingQuestions = await Question.find({
            category: sheet.category,
            difficulty: sheet.difficulty,
            approachTags: randomTag,
            _id: { $nin: Array.from(usedQuestionIds) },
        });

        if (matchingQuestions.length === 0) continue;

        const picked = matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)];
        selectedQuestions.push(picked);
        usedQuestionIds.add(picked._id.toString());
    }

    return selectedQuestions;
};