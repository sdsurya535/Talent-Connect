import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { X, HelpCircle, Plus } from "lucide-react";

const QUESTION_TYPES = [
  {
    id: "background",
    label: "Background Check",
    question: "Are you willing to undergo a background check?",
  },
  {
    id: "license",
    label: "Driver's License",
    question: "Do you have a valid driver's license?",
  },
  {
    id: "drug",
    label: "Drug Test",
    question: "Are you willing to take a drug test?",
  },
  {
    id: "education",
    label: "Education",
    question: "What is your highest level of education?",
  },
  {
    id: "expertise",
    label: "Expertise with Skill",
    question: "How many years of work experience do you have with [Skill]?",
  },
  {
    id: "hybrid",
    label: "Hybrid Work",
    question: "Are you comfortable with a hybrid work arrangement?",
  },
  {
    id: "industry",
    label: "Industry Experience",
    question: "How many years of experience do you have in this industry?",
  },
  {
    id: "language",
    label: "Language",
    question: "Are you fluent in [Language]?",
  },
  {
    id: "location",
    label: "Location",
    question: "Are you located in or willing to relocate to [Location]?",
  },
  {
    id: "onsite",
    label: "Onsite Work",
    question: "Are you willing to work onsite?",
  },
  {
    id: "remote",
    label: "Remote Work",
    question: "Are you willing to work remotely?",
  },
  {
    id: "urgent",
    label: "Urgent Hiring Need",
    question: "Are you available to start immediately?",
  },
  {
    id: "visa",
    label: "Visa Status",
    question: "Do you have work authorization in [Country]?",
  },
  {
    id: "work_auth",
    label: "Work Authorization",
    question: "Are you legally authorized to work in [Country]?",
  },
  {
    id: "experience",
    label: "Work Experience",
    question: "How many years of total work experience do you have?",
  },
  { id: "custom", label: "Custom Question", question: "" },
];

const RESPONSE_TYPES = {
  YESNO: "Yes / No",
  TEXT: "Text",
  NUMBER: "Number",
  SELECT: "Select",
};

const getDefaultResponseType = (questionType) => {
  switch (questionType) {
    case "education":
      return RESPONSE_TYPES.SELECT;
    case "expertise":
    case "industry":
    case "experience":
      return RESPONSE_TYPES.NUMBER;
    case "custom":
      return RESPONSE_TYPES.YESNO;
    default:
      return RESPONSE_TYPES.YESNO;
  }
};

const ScreeningQuestions = ({ value = [], onChange }) => {
  const [questions, setQuestions] = useState(value);

  const handleAddQuestion = (type) => {
    const questionType = QUESTION_TYPES.find((t) => t.id === type);
    const newQuestion = {
      id: Date.now(),
      type,
      question: questionType.question,
      skill: "",
      language: "",
      location: "",
      country: "",
      responseType: getDefaultResponseType(type),
      idealAnswer: "Yes",
      minimumYears: "1",
      isMandatory: false,
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  const handleRemoveQuestion = (id) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  const handleQuestionChange = (id, field, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        const updatedQuestion = { ...q, [field]: value };

        // Update question text for certain types when related fields change
        if (field === "skill" && q.type === "expertise") {
          updatedQuestion.question = `How many years of work experience do you have with ${value}?`;
        } else if (field === "language" && q.type === "language") {
          updatedQuestion.question = `Are you fluent in ${value}?`;
        } else if (field === "location" && q.type === "location") {
          updatedQuestion.question = `Are you located in or willing to relocate to ${value}?`;
        } else if (
          field === "country" &&
          (q.type === "visa" || q.type === "work_auth")
        ) {
          updatedQuestion.question =
            q.type === "visa"
              ? `Do you have work authorization in ${value}?`
              : `Are you legally authorized to work in ${value}?`;
        }

        return updatedQuestion;
      }
      return q;
    });
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  const renderQuestionFields = (question) => {
    switch (question.type) {
      case "expertise":
        return (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Skill*</label>
              <Input
                value={question.skill}
                onChange={(e) =>
                  handleQuestionChange(question.id, "skill", e.target.value)
                }
                placeholder="Core Java"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Minimum years required*
              </label>
              <Input
                type="number"
                value={question.minimumYears}
                onChange={(e) =>
                  handleQuestionChange(
                    question.id,
                    "minimumYears",
                    e.target.value
                  )
                }
                min="0"
              />
            </div>
          </div>
        );

      case "language":
        return (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Language*</label>
            <Input
              value={question.language}
              onChange={(e) =>
                handleQuestionChange(question.id, "language", e.target.value)
              }
              placeholder="English"
            />
          </div>
        );

      case "location":
        return (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Location*</label>
            <Input
              value={question.location}
              onChange={(e) =>
                handleQuestionChange(question.id, "location", e.target.value)
              }
              placeholder="New York, NY"
            />
          </div>
        );

      case "visa":
      case "work_auth":
        return (
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Country*</label>
            <Input
              value={question.country}
              onChange={(e) =>
                handleQuestionChange(question.id, "country", e.target.value)
              }
              placeholder="United States"
            />
          </div>
        );

      case "custom":
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                Help keep the platform respectful and professional.
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Question*
              </label>
              <Textarea
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(question.id, "question", e.target.value)
                }
                placeholder='Try asking a question like, "Will you be able to bring your own device?"'
                className="h-24"
              />
              <div className="text-right text-sm text-gray-500">
                {question.question.length}/200
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderResponseTypeField = (question) => {
    if (question.type === "education") {
      return (
        <div>
          <label className="block text-sm font-medium mb-1">
            Required education level
          </label>
          <Select
            value={question.idealAnswer}
            onValueChange={(value) =>
              handleQuestionChange(question.id, "idealAnswer", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's">Master's Degree</SelectItem>
              <SelectItem value="Doctorate">Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (question.responseType === RESPONSE_TYPES.YESNO) {
      return (
        <div>
          <label className="block text-sm font-medium mb-1">Ideal answer</label>
          <Select
            value={question.idealAnswer}
            onValueChange={(value) =>
              handleQuestionChange(question.id, "idealAnswer", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ideal answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (question.responseType === RESPONSE_TYPES.NUMBER) {
      return (
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum required
          </label>
          <Input
            type="number"
            value={question.minimumYears}
            onChange={(e) =>
              handleQuestionChange(question.id, "minimumYears", e.target.value)
            }
            min="0"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Screening questions</h2>
        <p className="text-gray-600">
          We recommend adding 3 or more questions. Applicants must answer each
          question.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="mb-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  {question.question || "New Question"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {renderQuestionFields(question)}

                {question.type === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Response type
                      </label>
                      <Select
                        value={question.responseType}
                        onValueChange={(value) =>
                          handleQuestionChange(
                            question.id,
                            "responseType",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select response type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={RESPONSE_TYPES.YESNO}>
                            Yes / No
                          </SelectItem>
                          <SelectItem value={RESPONSE_TYPES.TEXT}>
                            Text
                          </SelectItem>
                          <SelectItem value={RESPONSE_TYPES.NUMBER}>
                            Number
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {renderResponseTypeField(question)}
                  </div>
                )}

                {question.type !== "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    {renderResponseTypeField(question)}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`mandatory-${question.id}`}
                    checked={question.isMandatory}
                    onCheckedChange={(checked) =>
                      handleQuestionChange(question.id, "isMandatory", checked)
                    }
                  />
                  <label
                    htmlFor={`mandatory-${question.id}`}
                    className="text-sm"
                  >
                    Must-have qualification
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Add screening questions:</h3>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => handleAddQuestion(type.id)}
            >
              <Plus className="w-4 h-4" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScreeningQuestions;
