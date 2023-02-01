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

class SessionService {
  static cache_ (scope) {
    if (scope === 'user') return CacheService.getUserCache()
    if (scope === 'script') return CacheService.getScriptCache()
    if (scope === 'document') return CacheService.getDocumentCache()
    throw new Error('Invalid scope.')
  }

  static endSession (uuid, scope) {
    if (!Locksmith.testUuid(uuid)) throw new Error('Invalid UUID.')
    this.cache_(scope).remove(
      Locksmith.computeSignature(`/session/${Session.getTemporaryActiveUserKey()}/${uuid}/`))
  }

  static getSession (uuid, scope) {
    return new SessionNode(uuid, scope)
  }

  static startSession (scope, ttl = 600) {
    const uuid = Utilities.getUuid()
    this.cache_(scope).put(
      Locksmith.computeSignature(`/session/${Session.getTemporaryActiveUserKey()}/${uuid}/`),
      {
        ttl: ttl > 0 ? new Date().getTime() + ttl * 1000 : 0,
        uuid,
        contexts: {},
        properties: {}
      },
      ttl > 0 ? ttl : 600)
    return new SessionNode(uuid, scope)
  }
}
