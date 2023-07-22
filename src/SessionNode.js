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
  constructor (address, scope) {
    super(scope)

    const session = this.cache_.get(address)
    if (!session) throw new Error('Session expired.')
    if (!Locksmith.testUuid(session.uuid)) throw new Error('Invalid UUID.')

    this._config = { level: session.level, ttl: session.ttl, uuid: session.uuid }
    Object.freeze(this._config)

    if (session.ttl && session.ttl < new Date().getTime()) throw new Error('Session expired.')
    if (session.ttl === 0) this._session = session

    Object.freeze(this)
  }

  getContext (name, ttl = 0) {
    const session = this._session
    if (session.contexts[name]) {
      const address = this.address_(session.contexts[name], this._config.level + 1)
      return new SessionNode(address, this._scope)
    }

    const context = this.putSession_(this._config.level + 1, ttl)
    session.contexts[name] = context.getUuid()
    this._session = session
    return context
  }

  removeContext (name) {
    const session = this._session
    if (!session.contexts[name]) return

    this.removeSession_(session.contexts[name], this._config.level + 1)

    delete session.contexts[name]
    this._session = session
  }
}
