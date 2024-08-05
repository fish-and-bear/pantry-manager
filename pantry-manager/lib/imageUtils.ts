export async function prepareImageForVertexAI(imageUrl: string): Promise<string> {
    // Fetch the image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
  
    return base64;
  }