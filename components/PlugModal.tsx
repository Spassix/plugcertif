'use client'

import { XMarkIcon, MapPinIcon, TruckIcon, UsersIcon, LinkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

interface PlugModalProps {
  plug: any
  onClose: () => void
  isOpen: boolean
}

export default function PlugModal({ plug, onClose, isOpen }: PlugModalProps) {

  if (!plug) return null

  // Utiliser customNetworks s'il existe, sinon utiliser l'ancien format
  const socialNetworks = plug.customNetworks && plug.customNetworks.length > 0
    ? plug.customNetworks.map((network: any) => ({
        name: network.name,
        value: network.link,
        icon: network.emoji,
        color: 'from-gray-600 to-gray-700' // Couleur par défaut
      }))
    : [
        { name: 'Snapchat', value: plug.socialNetworks?.snap, icon: '👻', color: 'from-yellow-400 to-yellow-500' },
        { name: 'Instagram', value: plug.socialNetworks?.instagram, icon: '📷', color: 'from-purple-500 to-pink-500' },
        { name: 'WhatsApp', value: plug.socialNetworks?.whatsapp, icon: '💬', color: 'from-green-500 to-green-600' },
        { name: 'Signal', value: plug.socialNetworks?.signal, icon: '🔒', color: 'from-blue-500 to-blue-600' },
        { name: 'Telegram', value: plug.socialNetworks?.telegram, icon: '✈️', color: 'from-blue-400 to-blue-500' },
        { name: 'Threema', value: plug.socialNetworks?.threema, icon: '🔐', color: 'from-gray-600 to-gray-700' },
        { name: 'Potato', value: plug.socialNetworks?.potato, icon: '🥔', color: 'from-orange-500 to-orange-600' },
      ].filter(network => network.value)

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'FR': '🇫🇷',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'CA': '🇨🇦',
      'LU': '🇱🇺'
    }
    return flags[country] || '🌍'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div
        className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl z-50"
      >
        <div className="bg-gray-900 rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
              {/* Header avec image */}
              <div className="relative h-80 md:h-[28rem] flex-shrink-0 rounded-t-3xl overflow-hidden bg-gray-900">
                {plug.photo ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={plug.photo}
                      alt={plug.name}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                    {/* Gradient overlay très léger seulement en bas pour le texte */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-8xl opacity-50">🔌</span>
                  </div>
                )}
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{plug.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5" />
                      <span className="font-medium">
                        {plug.countries && plug.countries.length > 0 ? (
                          plug.countries.map((countryCode: string, index: number) => (
                            <span key={countryCode}>
                              {getCountryFlag(countryCode)} {countryCode}
                              {index < plug.countries.length - 1 && ' • '}
                            </span>
                          ))
                        ) : (
                          <span>{getCountryFlag(plug.location?.country || plug.country || 'FR')} {plug.location?.country || plug.country || 'FR'}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl p-4 text-center border border-red-600/30">
                      <HeartSolid className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{plug.likes || 0}</div>
                      <div className="text-sm text-gray-400">J'aime</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 text-center border border-blue-600/30">
                      <LinkIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{plug.referralCount || 0}</div>
                      <div className="text-sm text-gray-400">Parrainages</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-4 text-center border border-green-600/30">
                      <UsersIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{socialNetworks.length}</div>
                      <div className="text-sm text-gray-400">Réseaux</div>
                    </div>
                  </div>

                  {/* Méthodes de livraison */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <TruckIcon className="w-6 h-6 text-blue-400" />
                      Méthodes disponibles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {plug.methods?.delivery && (
                        <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4 text-center">
                          <span className="text-3xl mb-2 block">🚚</span>
                          <span className="text-white font-medium">Livraison</span>
                        </div>
                      )}
                      {plug.methods?.shipping && (
                        <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-4 text-center">
                          <span className="text-3xl mb-2 block">📦</span>
                          <span className="text-white font-medium">Envoi postal</span>
                        </div>
                      )}
                      {plug.methods?.meetup && (
                        <div className="bg-purple-600/20 border border-purple-600/30 rounded-xl p-4 text-center">
                          <span className="text-3xl mb-2 block">🤝</span>
                          <span className="text-white font-medium">Meetup</span>
                        </div>
                      )}
                    </div>

                    {/* Départements de livraison */}
                    {plug.deliveryDepartments && plug.deliveryDepartments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">🚚 Livraison disponible dans les départements :</h4>
                        <div className="flex flex-wrap gap-2">
                          {plug.deliveryDepartments.map((dept: string) => (
                            <span key={dept} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium border border-blue-600/30">
                              {dept}
                            </span>
                          ))}
                        </div>
                        
                        {/* Codes postaux de livraison */}
                        {plug.deliveryPostalCodes && plug.deliveryPostalCodes.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-xs font-medium text-gray-500 mb-1">Codes postaux spécifiques :</h5>
                            <div className="flex flex-wrap gap-1">
                              {plug.deliveryPostalCodes.map((code: string) => (
                                <span key={code} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                                  {code}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pays d'envoi postal */}
                    {plug.shippingCountries && plug.shippingCountries.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">📮 Envoi postal disponible vers :</h4>
                        <div className="flex flex-wrap gap-2">
                          {plug.shippingCountries.map((code: string) => {
                            const getCountryFlag = (country: string) => {
                              const flags: { [key: string]: string } = {
                                'FR': '🇫🇷', 'BE': '🇧🇪', 'CH': '🇨🇭',
                                'CA': '🇨🇦', 'LU': '🇱🇺', 'MC': '🇲🇨'
                              }
                              return flags[country] || '🌍'
                            }
                            const flag = getCountryFlag(code)
                            return (
                              <span key={code} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm font-medium border border-green-600/30">
                                {flag} {code}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Zones de meetup */}
                    {plug.meetupDepartments && plug.meetupDepartments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">🤝 Meetup possible dans les départements :</h4>
                        <div className="flex flex-wrap gap-2">
                          {plug.meetupDepartments.map((dept: string) => (
                            <span key={dept} className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-medium border border-purple-600/30">
                              {dept}
                            </span>
                          ))}
                        </div>
                        
                        {/* Codes postaux de meetup */}
                        {plug.meetupPostalCodes && plug.meetupPostalCodes.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-xs font-medium text-gray-500 mb-1">Codes postaux spécifiques :</h5>
                            <div className="flex flex-wrap gap-1">
                              {plug.meetupPostalCodes.map((code: string) => (
                                <span key={code} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                                  {code}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Réseaux sociaux */}
                  {socialNetworks.length > 0 && (
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-6 h-6 text-purple-400" />
                        Réseaux sociaux
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {socialNetworks.map((network: any) => (
                          <a
                            key={network.name}
                            href={network.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`bg-gradient-to-r ${network.color} p-3 rounded-xl text-center cursor-pointer hover:scale-105 transition-transform block`}
                          >
                            <span className="text-2xl mb-1 block">{network.icon}</span>
                            <span className="text-white text-sm font-medium">{network.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {plug.description && (
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{plug.description}</p>
                    </div>
                  )}


                </div>
              </div>
            </div>
          </div>
        </>
      )
    }