"use client";

import { Container } from "@/components/common/container";
import KanbanMock from "@/components/kaban/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ParsedJD } from "@/src/types/parseJD";
import React, { useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [JD, setJD] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<ParsedJD | null>(null);

  async function handleSubmit() {
    if (!JD.trim()) {
      setError("Please enter a job description");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        body: JSON.stringify({ jd: JD }), // ✅ FIXED
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ IMPORTANT (cookies auto sent)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      setParsedData(data);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveApplication() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({ ...parsedData }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
      setError("Network Error");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <Container className="flex flex-col ">
      {/* NAV */}
      <nav className="flex  items-center justify-between border-b py-4">
        <h2>Kaban Board</h2>
        <Button onClick={() => setIsOpen(true)} variant={"secondary"}>
          Add Application
        </Button>
      </nav>
      <KanbanMock />

      {/* MODAL */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            setParsedData(null);
            setJD("");
          }}
          className="fixed inset-0 w-full h-screen backdrop-blur-sm flex items-center justify-center"
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <CardHeader>
              <CardTitle>Add Job Description</CardTitle>
              <CardAction
                className="hover:bg-red-300 rounded-2xl p-1"
                onClick={() => {
                  setIsOpen(false);
                  setParsedData(null);
                  setJD("");
                }}
              >
                close
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* 🔹 STEP 1: JD INPUT */}
              {!parsedData && (
                <>
                  <Input
                    value={JD}
                    onChange={(e) => setJD(e.target.value)}
                    placeholder="Paste your job description here"
                  />

                  {error && <p className="text-sm text-red-500">{error}</p>}
                </>
              )}

              {/* 🔹 STEP 2: EDITABLE PARSED DATA */}
              {parsedData && (
                <div className="space-y-3">
                  <Input
                    value={parsedData.company}
                    placeholder="Company"
                    onChange={(e) =>
                      setParsedData({ ...parsedData, company: e.target.value })
                    }
                  />

                  <Input
                    value={parsedData.role}
                    placeholder="Role"
                    onChange={(e) =>
                      setParsedData({ ...parsedData, role: e.target.value })
                    }
                  />

                  <Input
                    value={parsedData.location}
                    placeholder="Location"
                    onChange={(e) =>
                      setParsedData({ ...parsedData, location: e.target.value })
                    }
                  />

                  <Input
                    value={parsedData.seniority}
                    placeholder="Seniority"
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        seniority: e.target.value,
                      })
                    }
                  />

                  {/* Skills (simple input for now) */}
                  <Input
                    value={parsedData.requiredSkills.join(", ")}
                    placeholder="Required Skills (comma separated)"
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        requiredSkills: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      })
                    }
                  />

                  <Input
                    value={parsedData.niceToHaveSkills.join(", ")}
                    placeholder="Nice to Have Skills"
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        niceToHaveSkills: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      })
                    }
                  />
                </div>
              )}
            </CardContent>

            <CardFooter>
              {!parsedData ? (
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Parsing..." : "Parse JD"}
                </Button>
              ) : (
                <Button onClick={handleSaveApplication} className="w-full">
                  Save Application
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </Container>
  );
}
