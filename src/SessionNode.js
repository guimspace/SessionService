/**
 * SessionService: Temporarily caches values for streamline processing
 * Copyright (C) 2022 Guilherme T Maeoka
 * <https://github.com/guimspace/SessionService>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

class SessionNode extends SuperSession {
  constructor (uuid, scope) {
    if (!Locksmith.testUuid(uuid)) throw new Error('Invalid UUID.')

    super(scope)
    this._config = { ttl: -1, uuid }

    const session = this._session
    if (uuid !== session?.uuid) throw new Error('Session expired.')
    if (session.ttl && session.ttl < new Date().getTime()) throw new Error('Session expired.')
    if (session.ttl === 0) this._session = session

    this._config.ttl = session.ttl
    Object.freeze(this._config)

    Object.freeze(this)
  }

  get _address () {
    return Locksmith.computeSignature(`/session/${Session.getTemporaryActiveUserKey()}/${this._config.uuid}/`)
  }

  getContext (name, ttl = 0) {
    const session = this._session
    if (session.contexts[name]) return new SessionNode(session.contexts[name], this._scope)

    const context = new SessionInterface(this._scope).startSession(ttl)
    session.contexts[name] = context.getUuid()
    this._session = session
    return context
  }

  removeContext (name) {
    const session = this._session
    if (!session.contexts[name]) return

    new SessionInterface(this._scope).endSession(session.contexts[name])

    delete session.contexts[name]
    this._session = session
  }
}
