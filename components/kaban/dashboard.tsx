"use client";
import { Button } from "../ui/button";
import { Application } from "@/prisma/generated/prisma/client";
import { GroupedApplications } from "@/src/types/applications";
import { ParsedJD } from "@/src/types/parseJD";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "../Modal";
import { Trash2 } from "lucide-react";
import { getErrorMessage } from "@/lib/helperFn";

export default function KanbanMock({
  initialData,
}: {
  initialData: GroupedApplications<Application>;
}) {
  const router = useRouter();
  const draggedItem = useRef<Application | null>(null);
  const draggedContainer = useRef<
    keyof GroupedApplications<Application> | null
  >(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [JD, setJD] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedJD | null>(null);
  const [data, setData] =
    useState<GroupedApplications<Application>>(initialData);

  async function handleSubmit(): Promise<void> {
    if (!JD.trim() || JD.length < 50) {
      setError("Please enter a valid job description");
      return;
    }

    setLoading(true);
    setError("");

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
      if (err) {
        alert(err);
      }
      const data = await res.json();
      setParsedData(data);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveApplication(): Promise<void> {
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

      const err = await getErrorMessage(res);
      if (err) {
        alert(err);
        return;
      }
      alert("Application saved successfully ✅");

      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      setError("Network Error");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  function handleDragStart(
    e: React.DragEvent<HTMLDivElement>,
    item: Application,
    status: keyof GroupedApplications<Application>,
  ): void {
    draggedItem.current = item;
    draggedContainer.current = status;
    e.currentTarget.style.opacity = "0.5";
  }

  function handleDragEnd(
    e: React.DragEvent<HTMLDivElement>,
    _item: Application,
    _status: keyof GroupedApplications<Application>,
  ): void {
    e.currentTarget.style.opacity = "1";
  }

  async function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
    targetContainer: keyof GroupedApplications<Application>,
  ): Promise<void> {
    e.preventDefault();

    const item = draggedItem.current;
    const sourceContainer = draggedContainer.current;

    if (!item || !sourceContainer) return;

    if (sourceContainer === targetContainer) {
      draggedItem.current = null;
      draggedContainer.current = null;
      return;
    }

    setData((prev) => {
      const newData: GroupedApplications<Application> = { ...prev };

      newData[sourceContainer] = newData[sourceContainer].filter(
        (i) => i.id !== item.id,
      );

      newData[targetContainer] = [...newData[targetContainer], item];

      return newData;
    });

    try {
      const res = await fetch(`/api/applications/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: targetContainer }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
      alert("Success");
    } catch (error) {
      console.error(error);
      alert("Failed to update status. Reverting changes.");
      setData((prev) => {
        const newData: GroupedApplications<Application> = { ...prev };

        newData[targetContainer] = newData[targetContainer].filter(
          (i) => i.id !== item.id,
        );

        newData[sourceContainer!] = [...newData[sourceContainer!], item];

        return newData;
      });
    }

    draggedItem.current = null;
    draggedContainer.current = null;
  }

  function handleClickModal(item: ParsedJD | Application): void {
    setIsOpen(true);
    setIsEdit(true);
    setParsedData(item as ParsedJD);
  }

  async function handleEditData(): Promise<void> {
    setLoading(true);

    try {
      const res = await fetch(`/api/applications/${parsedData?.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...parsedData }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const err = await getErrorMessage(res);

      if (err) {
        alert(err);
        return;
      }

      alert("Application updated successfully ✅");

      router.refresh();
    } catch (error) {
      alert("Network error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setParsedData(null);
      setIsOpen(false);
      setIsEdit(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    setLoading(true);

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const err = await getErrorMessage(res);

      if (err) {
        alert(err);
        return;
      }

      setData((prev) => {
        const newData = { ...prev };

        Object.keys(newData).forEach((key) => {
          newData[key as keyof typeof newData] = newData[
            key as keyof typeof newData
          ].filter((item) => item.id !== id);
        });

        return newData;
      });

      alert("Application deleted successfully ✅");
    } catch (error) {
      alert("Network error. Please check your connection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        {(
          Object.entries(data) as [
            keyof GroupedApplications<Application>,
            Application[],
          ][]
        ).map(([status, items]) => (
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

              {items.map((item: Application) => (
                <div
                  onClick={() => handleClickModal(item)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, status)}
                  onDragEnd={(e) => handleDragEnd(e, item, status)}
                  key={item.id}
                  className="bg-yellow-500 relative rounded-lg p-3 shadow hover:shadow-md transition"
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    variant={"ghost"}
                    className="absolute  text-red-600 hover:text-black hover:bg-primary/20  bottom-0 right-0"
                  >
                    <Trash2 className="stroke-2" />
                  </Button>
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
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          JD={JD}
          setJD={setJD}
          loading={loading}
          error={error}
          parsedData={parsedData}
          setParsedData={setParsedData}
          handleSubmit={handleSubmit}
          handleSaveApplication={handleSaveApplication}
          isEdit={isEdit}
          handleEditData={handleEditData}
          setIsEdit={setIsEdit}
        />
      )}
    </>
  );
}
