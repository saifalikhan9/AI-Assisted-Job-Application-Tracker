import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { ParsedJD } from "@/src/types/parseJD";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  JD: string;
  setJD: (jd: string) => void;
  loading: boolean;
  error: string;
  parsedData: ParsedJD | null;
  setParsedData: (data: ParsedJD | null) => void;
  handleSubmit: () => void;
  handleSaveApplication: () => void;
  isEdit: boolean;
  handleEditData: () => void;
  setIsEdit: (isEdit: boolean) => void;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
  JD,
  setJD,
  loading,
  error,
  parsedData,
  setParsedData,
  handleSubmit,
  handleSaveApplication,
  isEdit,
  handleEditData,
  setIsEdit,
}) => {
  return (
    <div
      onClick={() => {
        setIsOpen(false);
        setParsedData(null);
        setJD("");
        setIsEdit(false);
      }}
      className="fixed inset-0 w-full h-screen backdrop-blur-sm flex items-center justify-center"
    >
      <Card onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Add Job Description</CardTitle>
          <CardAction
            className="hover:bg-red-300 rounded-2xl p-1"
            onClick={() => {
              setIsOpen(false);
              setParsedData(null);
              setJD("");
              setIsEdit(false);
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
          ) : isEdit ? (
            <Button
              disabled={loading}
              onClick={handleEditData}
              className="w-full"
            >
              {loading ? "Editing..." : "Edit"}
            </Button>
          ) : (
            <Button
              disabled={loading}
              onClick={handleSaveApplication}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Application"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
