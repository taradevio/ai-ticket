export const Select = ({ id, items, register }) => {
  return (
    <select id={id} defaultValue="Select a category" className="select" {...register}>
      <option disabled={true} value="">Select a Category</option>
      {items.map((item) => (
        <option key={item.id} value={item.name}>{item.name}</option>
      ))}
    </select>
  );
};
