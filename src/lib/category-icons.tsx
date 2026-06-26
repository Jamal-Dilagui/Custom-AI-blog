import {
  Heart, Home, Plane, UtensilsCrossed, BookOpen, Sparkles,
  Camera, Music, Palette, Dumbbell, Leaf, Globe, Coffee,
  Feather, Mountain, Sun, type LucideProps,
} from 'lucide-react'

// Stable component that maps a category icon name to the right lucide icon.
// Using a switch with module-level icon references keeps the linter happy
// (no component is "created during render").
export function CategoryIcon({ name, ...props }: { name?: string | null } & LucideProps) {
  switch (name) {
    case 'Heart': return <Heart {...props} />
    case 'Home': return <Home {...props} />
    case 'Plane': return <Plane {...props} />
    case 'UtensilsCrossed': return <UtensilsCrossed {...props} />
    case 'BookOpen': return <BookOpen {...props} />
    case 'Sparkles': return <Sparkles {...props} />
    case 'Camera': return <Camera {...props} />
    case 'Music': return <Music {...props} />
    case 'Palette': return <Palette {...props} />
    case 'Dumbbell': return <Dumbbell {...props} />
    case 'Leaf': return <Leaf {...props} />
    case 'Globe': return <Globe {...props} />
    case 'Coffee': return <Coffee {...props} />
    case 'Mountain': return <Mountain {...props} />
    case 'Sun': return <Sun {...props} />
    case 'Feather':
    default:
      return <Feather {...props} />
  }
}
