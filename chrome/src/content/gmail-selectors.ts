export type ButtonType = 'reply' | 'replyAll' | 'forward' | 'trash' | 'send' | 'compose' | 'search' | 'cancel';

export const GMAIL_SELECTORS: Record<ButtonType, string[]> = {
  reply: [
    '[data-tooltip*="Reply"]',
    '[aria-label*="Reply"]',
    'div[role="button"][data-tooltip^="Reply "]'
  ],
  replyAll: [
    '[data-tooltip*="Reply all"]',
    '[aria-label*="Reply all"]'
  ],
  forward: [
    '[data-tooltip*="Forward"]',
    '[aria-label*="Forward"]'
  ],
  trash: [
    '[data-tooltip*="Delete"]',
    '[aria-label*="Delete"]',
    '[data-tooltip*="Trash"]'
  ],
  send: [
    '[data-tooltip="Send"]',
    'div[role="button"][aria-label*="Send"]',
    'button[name="send"]'
  ],
  compose: [
    '[gh="cm"]',
    '[data-tooltip*="Compose"]',
    'div[role="button"][aria-label*="Compose"]'
  ],
  search: [
    'input[aria-label*="Search"]',
    'input[name="q"]',
    'input[type="search"]'
  ],
  cancel: []
};

export function findGmailButton(type: ButtonType): HTMLElement | null {
  const selectors = GMAIL_SELECTORS[type];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && isElementVisible(element)) {
      return element;
    }
  }
  
  return null;
}

export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

export function observeGmailDOM(callback: () => void): MutationObserver {
  const observer = new MutationObserver(() => {
    callback();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-tooltip', 'aria-label', 'class']
  });
  
  return observer;
}

export function createCancelButton(): HTMLElement {
  const cancelBtn = document.createElement('div');
  cancelBtn.id = 'chord-cancel-button';
  cancelBtn.setAttribute('data-chord-action', 'cancel');
  cancelBtn.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(239, 68, 68, 0.9);
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `;
  cancelBtn.textContent = 'Cancel';
  document.body.appendChild(cancelBtn);
  return cancelBtn;
}

export function removeCancelButton(): void {
  const cancelBtn = document.getElementById('chord-cancel-button');
  if (cancelBtn) {
    cancelBtn.remove();
  }
}
