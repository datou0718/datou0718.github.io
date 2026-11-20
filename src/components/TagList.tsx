interface TagListProps {
    items: readonly string[];
}

export default function TagList({ items }: TagListProps) {
    return (
        <ul className="tag-list">
            {items.map(item => (
                <li key={item} className="glass-card tag-list-item">
                    {item}
                </li>
            ))}
        </ul>
    );
}
