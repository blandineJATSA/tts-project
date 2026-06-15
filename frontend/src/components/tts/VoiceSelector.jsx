import { mockVoices } from '@/data/mockVoices'
import { User } from 'lucide-react'

export default function VoiceSelector({ selectedVoice, onSelect }) {
  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm font-medium">
        Choisir une voix
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {mockVoices.map((voice) => {
          const isSelected = selectedVoice?.id === voice.id
          return (
            <button
              key={voice.id}
              onClick={() => onSelect(voice)}
              className={`flex flex-col items-start gap-1 p-4 rounded-xl border text-left
                         transition-all cursor-pointer
                         ${isSelected
                           ? 'border-primary bg-primary/5 ring-1 ring-primary'
                           : 'hover:border-primary/50 hover:bg-muted/50'
                         }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                              ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <User className="h-4 w-4" />
              </div>

              {/* Nom */}
              <span className="text-sm font-medium">{voice.name}</span>

              {/* Style */}
              <span className="text-xs text-muted-foreground">{voice.style}</span>

              {/* Badge genre */}
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1
                               ${isSelected
                                 ? 'bg-primary/20 text-primary'
                                 : 'bg-muted text-muted-foreground'
                               }`}>
                {voice.gender}
              </span>

            </button>
          )
        })}
      </div>

    </div>
  )
}