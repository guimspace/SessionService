/**
 * SessionService: Temporarily caches values for streamline processing
 * Copyright (C) 2022-2023 Guilherme T Maeoka
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

class SessionData {
  constructor (scope) {
    this._scope = scope

    if (scope === 'user') this.cache_ = CacheService.getUserCache()
    else if (scope === 'script') this.cache_ = CacheService.getScriptCache()
    else if (scope === 'document ') this.cache_ = CacheService.getDocumentCache()
    else throw new Error('Invalid scope.')
  }
}
