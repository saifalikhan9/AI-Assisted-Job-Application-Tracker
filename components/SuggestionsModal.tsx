"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getErrorMessage } from "@/lib/helperFn";
import { ParsedJD } from "@/src/types/parseJD";
import ReactMarkdown from "react-markdown";

export const SuggestionsModal = ({ suggestionsModal,setSuggestionsModal }: { suggestionsModal:boolean,setSuggestionsModal: (e:boolean) => void }) => {
  const [loading, setLoading] = useState(false);
  const [JD, setJd] = useState("");
  const [suggestions, setSuggestions] = useState(""); 
  const [parsedData, setParsedData] = useState<ParsedJD | null>(null);

  async function handleSubmit() {
    if (!JD.trim()) {
      alert("Please enter a job description");
      return;
    }

    setLoading(true);   
    setSuggestions(""); 

    try {
    
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        body: JSON.stringify({ jd: JD }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const err = await getErrorMessage(res);
      if (err) return alert(err);

      const parsed = await res.json();
      setParsedData(parsed);

      if (!parsed || parsed.requiredSkills.length === 0) {
        return alert("Not enough data to generate suggestions");
      }

   
      const result = await fetch("/api/ai/suggestions", {
        method: "POST",
        body: JSON.stringify({
          requiredSkills: parsed.requiredSkills,
          niceToHaveSkills: parsed.niceToHaveSkills,
          role: parsed.role,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const error2 = await getErrorMessage(result);
      if (error2) return alert(error2);

     
      const reader = result.body?.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;

        const chunk = decoder.decode(value || new Uint8Array());

  
        setSuggestions((prev) => prev + chunk);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={()=>setSuggestionsModal(false)} 
      className="fixed inset-0 w-full h-screen backdrop-blur-sm flex items-center justify-center"
    >
      <Card
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md"
      >
        <CardHeader>
          <CardTitle>Get Tailored Resume Bullet Points</CardTitle>
          <CardDescription>
            Generate resume points based on job description
          </CardDescription>
  
          <CardAction
            onClick={(e) => {
              e.stopPropagation(); 
              setSuggestionsModal(false);
            }}
            className="cursor-pointer hover:text-red-500"
          >
            close
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            value={JD}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the Job Description here"
          />


          {suggestions && (
            <div className="mt-3 p-3 border rounded bg-muted max-h-60 overflow-y-auto">
              <ReactMarkdown>{suggestions}</ReactMarkdown>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};