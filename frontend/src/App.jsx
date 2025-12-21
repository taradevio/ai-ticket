// import { useState } from 'react'
import { Plus } from "lucide-react";
import { Search } from "./ui/Search";
import { Dropdown } from "./ui/Dropdown";
import { Table } from "./ui/Table";

function App() {
  // const [count, setCount] = useState(0)

  const buttonDropdown = [
    {
      id: 1,
      name: "Status",
      items: ["Open", "Closed", "Pending"],
    },
    {
      id: 2,
      name: "Priority",
      items: ["High", "Medium", "Low"],
    },
    {
      id: 3,
      name: "Sentiment",
      items: ["Positive", "Neutral", "Negative"],
    },
    {
      id: 4,
      name: "Assignee",
      items: ["Unassigned", "Me", "John Doe"],
    },
  ];

  return (
    <div className="ps-5 pe-5">
      <div className="flex justify-between items-center mt-3">
        <div>
          <h1 className="text-3xl text-bold">All Tickets</h1>
          <p>Manage and track all customers support interactions</p>
        </div>
        <div>
          <button className="btn btn-primary">
            <Plus className="w-4" />
            New Ticket
          </button>
        </div>
      </div>
      <div className="my-5">
        <Search />
        {buttonDropdown.map((dropdown) => (
          <Dropdown
            key={dropdown.id}
            names={dropdown.name}
            items={dropdown.items}
          />
        ))}
      </div>
      <div>
        <Table />
      </div>
    </div>
  );
}

export default App;
