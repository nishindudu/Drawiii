import './inputs.css';
import { ArrowDownToLine, ChevronRight } from 'lucide-react';

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
        <button type="button" className="btn" style={{ 'fontSize':size }} onClick={onclick}>{text}</button>
    )
}

function ToggleQuickColours() {
    return (
        <ChevronRight
            color='#ffffff'
            onClick={() => {
                document.querySelector('.quick-colour-picker').classList.toggle('hide-quick-colour');
                document.querySelector('.toggle-quick-colours').classList.toggle('toggle-quick-colours-active');
            }}
            className='toggle-quick-colours'
        />
    )
}

export function QuickColourPicker({ colours = null, onChange }) {
    if (!colours) {
        colours = ['#ffffff', '#6feeff', '#92ff92', '#cd7dff', '#ff92b0', '#ff8bff', '#fe5555', '#ffcd7d', '#000000'];
    }
    return (
        <div className="quick-colour-picker-container">
            <ToggleQuickColours />
            <div className="quick-colour-picker">
                {colours.map((colour, index) => (
                    <div key={index} className="quick-colour" style={{ backgroundColor: colour }} onClick={() => onChange(colour)}></div>
                ))}
            </div>
        </div>
    )
}

export function ColourPicker({ color = '#ffffff', onChange }) {
    return (
        <input
            type="color"
            className="colour-picker"
            value={color}
            onChange={onChange}
        />
    )
}

export function DownloadButton({ onclick, color = '#ffffff' }) {
    return (
        <div className="download-btn" onClick={onclick}>
            <ArrowDownToLine size={24} color="#000000" style={{ width: 'inherit', height: 'inherit', maxHeight: 'inherit', maxWidth: 'inherit', scale: '0.9' }} />
        </div>
    )
}