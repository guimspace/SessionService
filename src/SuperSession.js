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

class SuperSession extends SessionData {
  get _session () {
    return Object.freeze(
      this.cache_.get(
        this.address_(this._config.uuid, this._config.level)))
  }

  set _session (session) {
    if (session.ttl === 0) {
      this.cache_.put(
        this.address_(this._config.uuid, this._config.level), session, 600)
    } else {
      const delta = this.ttl.delta()
      if (delta > 0) {
        this.cache_.put(
          this.address_(this._config.uuid, this._config.level), session, delta)
      } else {
        this.cache_.remove(
          this.address_(this._config.uuid, this._config.level))
      }
    }
  }

  get ttl () {
    return {
      time: this._config.ttl,
      delta: function () {
        return Math.floor((this.time - new Date().getTime()) / 1000)
      }
    }
  }

  deleteProperty (key) {
    delete this._session?.properties[key]
  }

  end () {
    this.cache_.remove(
      this.address_(this._config.uuid, this._config.level))
  }

  getProperty (key) {
    return this._session?.properties[key]
  }

  getUuid () {
    return this._config.uuid
  }

  isAlive () {
    return this.ttl.delta() > 0
  }

  setProperty (key, value) {
    const session = this._session
    session.properties[key] = value
    this._session = session
    return this
  }
}
