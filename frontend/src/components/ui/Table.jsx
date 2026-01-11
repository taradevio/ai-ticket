import { Smile } from "lucide-react";
import { Dot } from "lucide-react";
import { Status } from "./Status";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const Table = () => {
  const BACKEND = import.meta.env.VITE_BACKEND;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${BACKEND}/fetch-tickets`);
        const result = await response.json();

        if (result.success) {
          setTickets(result.ticket);
          setLoading(false);
        }
        console.log("Fetched tickets:", result);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [BACKEND]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchTickets();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="overflow-x-auto w-full p-4">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>ID</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Sentiment</th>
            <th>Priority</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center p-10">
                {" "}
                {/* Update Colspan jadi 8 */}
                <Loader2 className="animate-spin inline mr-2" /> Loading
                Tickets...
              </td>
            </tr>
          ) : tickets.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-20">
                {" "}
                {/* Update Colspan jadi 8 */}
                <div className="flex flex-col items-center justify-center opacity-50">
                  <Smile className="w-12 h-12 mb-2" />
                  <p className="text-lg font-medium">
                    Wah, belum ada tiket nih
                  </p>
                  <p className="text-sm">Semua aman terkendali.</p>
                </div>
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id} className="hover">
                <td className="font-mono text-xs text-zinc-500">
                  #{ticket.id.slice(0, 8)}
                </td>

                {/* 1. SUBJECT */}
                <td>
                  {ticket.ai_subject ? (
                    <div className="font-medium max-w-xs">
                      {ticket.ai_subject}
                    </div>
                  ) : (
                    <div className="skeleton h-4 w-32 bg-base-300"></div>
                  )}
                </td>

                {/* 2. CATEGORY */}
                <td>
                  <div className="badge badge-outline text-[10px] uppercase font-bold">
                    {ticket.category || "Uncategorized"}
                  </div>
                </td>

                {/* 3. SENTIMENT & SCORE */}
                <td>
                  {ticket.ai_sentiment ? (
                    <div className="flex flex-col gap-1">
                      <div
                        className={`badge badge-xs ${
                          ticket.ai_sentiment === "Positive"
                            ? "badge-success"
                            : ticket.ai_sentiment === "Negative"
                            ? "badge-error"
                            : "badge-ghost"
                        }`}
                      >
                        {ticket.ai_sentiment}
                      </div>
                      {/* <span className="text-[10px] font-mono italic">
                        Score: {ticket.ai_sentiment_score?.toFixed(2)}
                      </span> */}
                    </div>
                  ) : (
                    <span className="loading loading-dots loading-xs"></span>
                  )}
                </td>

                {/* 4. PRIORITY */}
                <td>
                  <div
                    className={`badge gap-1 ${
                      ticket.priority === "Critical"
                        ? "badge-error"
                        : ticket.priority === "High"
                        ? "badge-warning"
                        : ticket.priority === "Medium"
                        ? "badge-info"
                        : "badge-ghost"
                    }`}
                  >
                    {ticket.priority === "Critical" && (
                      <AlertCircle size={12} />
                    )}
                    {ticket.priority || "Low"}
                  </div>
                </td>

                {/* 5. CUSTOMER */}
                <td className="text-sm">{ticket.name}</td>

                {/* 6. STATUS (Ready if all AI fields are filled) */}
                <td>
                  {ticket.ai_subject && ticket.ai_sentiment ? (
                    <div className="badge badge-success badge-sm">Ready</div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-500 animate-pulse">
                      <Loader2 size={12} className="animate-spin" />
                      <span className="text-xs italic">Analyzing</span>
                    </div>
                  )}
                </td>

                {/* 7. ACTION */}
                <td>
                  <button className="btn btn-ghost btn-xs">Details</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
