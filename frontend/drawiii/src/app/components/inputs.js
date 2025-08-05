export default function Textbox({ text, id, value, onchange }) {
    return (
        <input 
            type="text"
            className="input-box"
            placeholder={text}
            id={id}
            onChange={onchange}
            value={value}
        />
    )
}

export function Button({ text, size, onclick }) {
    return (
        <button type="button" className="btn" style={{ 'font-size':size }} onClick={onclick}>{text}</button>
    )
}