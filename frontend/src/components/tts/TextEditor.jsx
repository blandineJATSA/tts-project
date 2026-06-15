export default function TextEditor({ text, onChange }) {
  const maxChars = 1000
  const remaining = maxChars - text.length

  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm font-medium">
        Votre texte
      </label>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxChars}
        rows={6}
        placeholder="Entrez le texte à convertir en audio...
Ex : Votre commande est en cours de livraison."
        className="border rounded-lg px-4 py-3 text-sm bg-background resize-none
                   focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Compteur de caractères */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{text.length} caractères</span>
        <span className={remaining < 100 ? 'text-red-500' : ''}>
          {remaining} restants
        </span>
      </div>

    </div>
  )
}