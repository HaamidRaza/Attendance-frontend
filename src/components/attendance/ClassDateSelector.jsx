import Select from "../common/Select";
import Input from "../common/Input";

export default function ClassDateSelector({
  classOptions,
  classId,
  date,
  onClassChange,
  onDateChange,
  maxDate,
  minDate,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl">
      <Select
        label="Class"
        placeholder="Select class"
        options={classOptions}
        value={classId}
        onChange={(e) => onClassChange(e.target.value)}
      />
      <Input
        label="Date"
        type="date"
        value={date}
        min={minDate}
        max={maxDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
}