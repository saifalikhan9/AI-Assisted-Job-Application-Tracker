"use client";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Application } from "@/prisma/generated/prisma/client";
import { GroupedApplications } from "@/src/types/applications";
import { ParsedJD } from "@/src/types/parseJD";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function KanbanMock({
  initialData,
}: {
  initialData: GroupedApplications<Application>;
}) {
  const router = useRouter();
  const draggedItem = useRef();
  const draggedContainer = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [JD, setJD] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<ParsedJD | null>(null);
  const [data, setData] = useState(initialData);

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

      if (!res.ok) {
        throw new Error("Failed to save");
      }
      router.refresh();
    } catch (error) {
      console.log(error);
      setError("Network Error");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  function handleDragStart(e, item, status) {
    draggedItem.current = item;
    draggedContainer.current = status;
    e.target.style.opacity = 0;
  }
  function handleDragEnd(e, item, status) {
    e.target.style.opacity = 1;
  }

  function handleDrop(e, targetContainer) {
    const item = draggedItem.current;
    const sourceContainer = draggedContainer.current;

    setData((prev) => {
      const newData = { ...prev };
      newData[sourceContainer] = newData[sourceContainer].filter(
        (i) => i !== item,
      );
      newData[targetContainer] = [...newData[targetContainer], item];
      return newData;
    });
  }

  return (
    <>
      <nav className="flex  items-center justify-between border-b py-4">
        <h2>Kaban Board</h2>
        <Button onClick={() => setIsOpen(true)} variant={"secondary"}>
          Add Application
        </Button>
      </nav>
      <div className=" text-balance grid grid-cols-5 gap-4 mt-6">
        {Object.entries(data).map(([status, items]) => (
          <div
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            key={status}
            className=" bg-neutral-800 rounded-xl p-3 min-h-[400px]"
          >
            {/* Column Title */}
            <h3 className="font-semibold mb-3 capitalize">
              {status.replace("_", " ")}
            </h3>

            {/* Cards */}
            <div className="flex flex-col gap-3">
              {items.length === 0 && (
                <p className="text-sm text-gray-600">No applications</p>
              )}

              {items.map((item) => (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, status)}
                  onDragEnd={(e) => handleDragEnd(e, item, status)}
                  key={item.id}
                  className="bg-yellow-500 rounded-lg p-3 shadow hover:shadow-md transition"
                >
                  <p className="font-semibold ">{item.company}</p>
                  <p className="text-sm text-gray-800">{item.role}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
}
