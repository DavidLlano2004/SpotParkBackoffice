'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hash, MessageSquare, Send, AtSign } from 'lucide-react'
import { cn } from '@utils/cn'
import { CHAT_CHANNELS, GUARD } from '../data/mock'
import type { ChatChannel, ChatMessage } from '@types-sp/vigilante.types'

export function VigilanteChat() {
  const [activeChannel, setActiveChannel] = useState(CHAT_CHANNELS[0].id)
  const [draft, setDraft] = useState('')
  const [channels, setChannels] = useState<ChatChannel[]>(CHAT_CHANNELS)
  const bottomRef = useRef<HTMLDivElement>(null)

  const channel = channels.find(c => c.id === activeChannel)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChannel, channel.messages.length])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      author: GUARD.name,
      initials: GUARD.initials,
      content: text,
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }
    setChannels(prev => prev.map(c =>
      c.id === activeChannel
        ? { ...c, messages: [...c.messages, msg], unread: 0 }
        : c,
    ))
    setDraft('')
  }

  const selectChannel = (id: string) => {
    setActiveChannel(id)
    setChannels(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  const channelChannels = channels.filter(c => c.type === 'channel')
  const dmChannels      = channels.filter(c => c.type === 'dm')

  return (
    <div className="max-w-[1100px] mx-auto h-[calc(100vh-96px)]">
      <div className="flex h-full gap-0 bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--sp-sh-card)', border: '1px solid var(--sp-border-card)' }}>
        {/* Channel list */}
        <div className="w-[220px] shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--sp-border-card)', background: '#F9F9F7' }}>
          <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--sp-border-card)' }}>
            <span className="text-[14px] font-semibold text-sp-t1">Mensajes</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 no-sb">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-sp-t3 px-2 mb-1">Canales</div>
            {channelChannels.map(ch => (
              <button
                key={ch.id}
                onClick={() => selectChannel(ch.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[12.5px] transition-colors mb-0.5',
                  activeChannel === ch.id ? 'bg-sp-ink text-white' : 'text-sp-t2 hover:bg-sp-bg/60',
                )}
              >
                <Hash size={13} className="shrink-0" />
                <span className="flex-1 text-left truncate">{ch.name}</span>
                {ch.unread > 0 && (
                  <span className="min-w-[16px] h-4 rounded-full bg-sp-red text-white text-[9px] font-bold flex items-center justify-center px-1">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))}

            <div className="text-[10px] font-semibold uppercase tracking-widest text-sp-t3 px-2 mb-1 mt-4">Mensajes directos</div>
            {dmChannels.map(ch => (
              <button
                key={ch.id}
                onClick={() => selectChannel(ch.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[12.5px] transition-colors mb-0.5',
                  activeChannel === ch.id ? 'bg-sp-ink text-white' : 'text-sp-t2 hover:bg-sp-bg/60',
                )}
              >
                <div className="w-5 h-5 rounded-full bg-sp-lime/80 flex items-center justify-center text-sp-ink text-[9px] font-bold shrink-0">
                  {ch.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="flex-1 text-left truncate">{ch.name}</span>
                {ch.unread > 0 && (
                  <span className="min-w-[16px] h-4 rounded-full bg-sp-red text-white text-[9px] font-bold flex items-center justify-center px-1">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div
            className="px-5 py-3.5 flex items-center gap-2.5 shrink-0"
            style={{ borderBottom: '1px solid var(--sp-border-card)' }}
          >
            {channel.type === 'channel' ? (
              <Hash size={16} className="text-sp-t3" />
            ) : (
              <AtSign size={16} className="text-sp-t3" />
            )}
            <span className="text-[14px] font-semibold text-sp-t1">{channel.name}</span>
            <span className="text-[12px] text-sp-t3 ml-auto">{channel.messages.length} mensajes</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 no-sb">
            {channel.messages.map((msg, i) => {
              const showMeta = i === 0 || channel.messages[i - 1]?.author !== msg.author
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn('flex gap-3', msg.isMine ? 'flex-row-reverse' : 'flex-row')}
                >
                  {showMeta && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                      style={{
                        background: msg.isMine ? 'var(--sp-ink)' : 'var(--sp-lime)',
                        color: msg.isMine ? 'var(--sp-lime)' : 'var(--sp-ink)',
                      }}
                    >
                      {msg.initials}
                    </div>
                  )}
                  {!showMeta && <div className="w-8 shrink-0" />}
                  <div className={cn('max-w-[70%]', msg.isMine ? 'items-end' : 'items-start', 'flex flex-col gap-0.5')}>
                    {showMeta && (
                      <div className={cn('flex items-center gap-2 mb-0.5', msg.isMine ? 'flex-row-reverse' : 'flex-row')}>
                        <span className="text-[11px] font-semibold text-sp-t1">{msg.author}</span>
                        <span className="text-[10px] text-sp-t3">{msg.time}</span>
                      </div>
                    )}
                    <div
                      className={cn('px-3.5 py-2.5 rounded-2xl text-[13px]', msg.isMine ? 'rounded-tr-sm' : 'rounded-tl-sm')}
                      style={{
                        background: msg.isMine ? 'var(--sp-ink)' : '#F3F4EF',
                        color: msg.isMine ? '#fff' : 'var(--sp-t1)',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 shrink-0" style={{ borderTop: '1px solid var(--sp-border-card)' }}>
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ border: '1px solid var(--sp-border)' }}
            >
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={`Mensaje en ${channel.type === 'channel' ? '#' : ''}${channel.name}…`}
                className="flex-1 text-[13px] text-sp-t1 bg-transparent outline-none placeholder:text-sp-t4"
              />
              <button
                onClick={sendMessage}
                disabled={!draft.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
                style={{ background: 'var(--sp-ink)', color: 'var(--sp-lime)' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
