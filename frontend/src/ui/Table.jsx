import { Smile } from "lucide-react";
import { Dot } from "lucide-react";
import { Status } from "./Status";

export const Table = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Customer</th>
            <th>Sentiment</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <td>#TK-001</td>
            <td>
              <div>
                <p>Login failure on main portal</p>
                <span className="text-sm opacity-50">Updated 2m ago</span>
              </div>
            </td>
            <td>
              <div className="">
                <h2 className="font-bold">Hart Hagerty</h2>
              </div>
            </td>
            <td>
              <div className="badge badge-success">
                <Smile className="w-4 h-4" />
                Positive
              </div>
            </td>
            <td>
              <Status status="High" />
            </td>
            <td>
              <div className="badge badge-info">Open</div>
            </td>
            <td>
              <div className="avatar">
                <div className="mask mask-squircle h-12 w-12">
                  <img
                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                    alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
