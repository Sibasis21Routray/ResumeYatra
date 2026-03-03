"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupLinesByY = groupLinesByY;
function groupLinesByY(items) {
    const lines = [];
    items
        .sort((a, b) => b.y - a.y)
        .forEach(item => {
        const line = lines.find(l => Math.abs(l.y - item.y) < 3);
        if (line) {
            line.text += ' ' + item.text;
        }
        else {
            lines.push({ ...item });
        }
    });
    return lines;
}
