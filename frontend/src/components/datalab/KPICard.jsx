export default function KPICard({ title, value, subtitle, color = 'default' }) {
  const colors = {
    default: 'bg-background border',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
  }

  return (
    <div className={`rounded-xl p-5 border flex flex-col gap-2 ${colors[color]}`}>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {title}
      </p>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}