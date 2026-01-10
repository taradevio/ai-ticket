import { Smile } from "lucide-react";
import { Dot } from "lucide-react";
import { Status } from "./Status";
import { Loader2 } from "lucide-react";
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
            <th>AI Subject (Summary)</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Full Table Loading State
            <tr>
              <td colSpan="5" className="text-center p-10">
                <Loader2 className="animate-spin inline mr-2" /> Loading
                Tickets...
              </td>
            </tr>
          ) : tickets.length === 0 ? (
            /* 2. STATE KOSONG (Kalo loading udah beres tapi data gak ada) */
            <tr>
              <td colSpan="5" className="text-center p-20">
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
                <td className="font-mono text-xs">#{ticket.id.slice(0, 8)}</td>
                <td>
                  {ticket.ai_summary ? (
                    <div className="font-medium">{ticket.ai_summary}</div>
                  ) : (
                    /* SKELETON KHUSUS SUMMARY YANG BELUM JADI */
                    <div className="flex flex-col gap-2">
                      <div className="skeleton h-4 w-56 animate-pulse bg-gray-200"></div>
                      <span className="text-[10px] text-orange-500 italic animate-bounce">
                        Analyzing...
                      </span>
                    </div>
                  )}
                </td>
                <td>{ticket.name}</td>
                <td>
                  {ticket.ai_summary ? (
                    <div className="badge badge-success gap-2">Ready</div>
                  ) : (
                    <div className="badge badge-warning gap-2">Processing</div>
                  )}
                </td>
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
