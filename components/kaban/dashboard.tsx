const mockData = {
  APPLIED: [
    { id: 1, company: "Amazon", role: "Frontend Dev", date: "Apr 5" },
    { id: 2, company: "Google", role: "React Dev", date: "Apr 6" },
  ],
  PHONE_SCREEN: [
    { id: 3, company: "Meta", role: "UI Engineer", date: "Apr 4" },
  ],
  INTERVIEW: [
    { id: 4, company: "Netflix", role: "Frontend Dev", date: "Apr 2" },
  ],
  OFFER: [],
  REJECTED: [{ id: 5, company: "Adobe", role: "Frontend Dev", date: "Apr 1" }],
};

export default function KanbanMock() {
  return (
    <div className=" text-balance grid grid-cols-5 gap-4 mt-6">
      {Object.entries(mockData).map(([status, items]) => (
        <div
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
                key={item.id}
                className="bg-yellow-500 rounded-lg p-3 shadow hover:shadow-md transition"
              >
                <p className="font-semibold ">{item.company}</p>
                <p className="text-sm text-gray-800">{item.role}</p>
                <p className="text-xs text-gray-600 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
