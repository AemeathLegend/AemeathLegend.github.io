async function getKey(password) {
  const enc = new TextEncoder();

  const keyMaterial =
    await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("some-fixed-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptAccessCode(
  accessCode,
  password,
) {
  const key = await getKey(password);

  const enc = new TextEncoder();

  const iv = crypto.getRandomValues(
    new Uint8Array(12),
  );

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      enc.encode(accessCode),
    );

  const combined = new Uint8Array(
    iv.length + encrypted.byteLength,
  );

  combined.set(iv);

  combined.set(
    new Uint8Array(encrypted),
    iv.length,
  );

  return btoa(
    String.fromCharCode(...combined),
  );
}

export async function decryptAccessCode(
  encryptedText,
  password,
) {
  const key = await getKey(password);

  const data = Uint8Array.from(
    atob(encryptedText),
    (c) => c.charCodeAt(0),
  );

  const iv = data.slice(0, 12);

  const encrypted = data.slice(12);

  const decrypted =
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encrypted,
    );

  return new TextDecoder().decode(
    decrypted,
  );
}