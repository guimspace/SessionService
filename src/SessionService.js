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
  static endSession (uuid = '') {
    const path = Locksmith.computeSignature(
      ['session',
        Session.getTemporaryActiveUserKey(),
        uuid.concat('')].join('/'));
    CacheService.getUserCache().remove(path);
  }

  static getSession (uuid) {
    return new SuperSession(uuid);
  }

  static hasSession (uuid = '') {
    Utilities.sleep(400);
    const path = Locksmith.computeSignature(
      ['session',
        Session.getTemporaryActiveUserKey(),
        uuid.concat('')].join('/'));
    return uuid === CacheService.getUserCache().get(path)?.uuid;
  }

  static startSession () {
    return new SuperSession();
  }
}
