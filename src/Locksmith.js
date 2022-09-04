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

class Locksmith {
  static computeSignature (value) {
    return this.computeHmacSha256Signature(
      value,
      this.computeDigestSha256(
        (function () {
          const c = CacheService.getScriptCache();
          return c.get('locksmith') || (function () {
            const v = PropertiesService.getScriptProperties().getProperty('locksmith');
            if (!v) throw new Error('Value not found.');
            c.put('locksmith', v);
            return v;
          })();
        })() + Session.getTemporaryActiveUserKey()));
  }

  static computeDigestSha256 (value) {
    return this.toHexString(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        value,
        Utilities.Charset.UTF_8));
  }

  static computeHmacSha256Signature (value, key) {
    return this.toHexString(
      Utilities.computeHmacSha256Signature(
        value, key, Utilities.Charset.UTF_8));
  }

  static testUuid (uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid);
  }

  static toHexString (byteArray) {
    return Array.from(byteArray, function (byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }
}
