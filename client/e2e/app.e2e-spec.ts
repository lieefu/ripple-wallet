import { RippleWalletClientPage } from './app.po';

describe('ripple-wallet-client App', () => {
  let page: RippleWalletClientPage;

  beforeEach(() => {
    page = new RippleWalletClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
