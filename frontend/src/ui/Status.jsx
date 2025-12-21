export const Status = ({ status }) => {
  return (
    <div className="flex items-center">
      <div className="inline-grid *:[grid-area:1/1]">
        <div className="status status-error animate-ping"></div>
        <div className="status status-error"></div>
      </div>
      <div>
        <p className="ms-2">{status}</p>
      </div>
    </div>
  );
};
