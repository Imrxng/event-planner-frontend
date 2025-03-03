export interface Option {
  value: string;
  label: string;
}

type Props = {
  value: string
  id: string
  name: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
  options: Option[],
  noLabel?: boolean
}

export const Select = ({ value, id, name, onChange, options, noLabel }: Props) => {
  return (
    <div className="flex flex-col mb-2">
      {noLabel ? null : <label htmlFor={id}>{name}</label>}
      <select className="border-1 border-grayMid rounded-sm py-1 px-2 focus:outline-none focus:border-grayMid focus:ring-transparent" id={id} value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export default Select