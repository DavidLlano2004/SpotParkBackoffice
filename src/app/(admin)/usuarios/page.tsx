import type { Metadata } from 'next'
import { UsuariosClient } from '@features/usuarios/components/UsuariosClient'

export const metadata: Metadata = { title: 'Usuarios' }

export default function UsuariosPage() {
  return <UsuariosClient />
}
