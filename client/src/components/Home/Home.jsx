import React, { useState, useEffect } from 'react';
import './Home.css';
import './../Dashboard/Dashboard.css';
import PaymentTypeModal from '../Modals/PaymentTypeModal';
import ContactPaymentTypeModal from '../Modals/ContactPaymentTypeModal'
import InvoicePaymentTypeModal from '../Modals/InvoicePaymentTypeModal'
import OfferPaymentTypeModal from '../Modals/OfferPaymentTypeModal'
import SuccessfulPaymentModal from '../Modals/SuccessfulPaymentModal'
import FailedPaymentModal from '../Modals/FailedPaymentModal'
import OfferQRCodeModal from '../Modals/OfferQRCodeModal'
import PaymentRequestModal from '../Modals/PaymentRequestModal'
import ModalFade from '../Modals/ModalFade';
import SharePaymentRequestModal from '../Modals/SharePaymentRequestModal'
import { handleCopy, handleBoltOfferDownload, intlNumberFormat } from '../../utils';

const Home = () => {
  const [isPaymentTypeModalOpen, setIsPaymentTypeModalOpen] = useState(false);
  const [isContactPaymentTypeModalOpen, setIsContactPaymentTypeModalOpen] = useState(false);
  const [isInvoicePaymentTypeModalOpen, setIsInvoicePaymentTypeModalOpen] = useState(false);
  const [isOfferPaymentTypeModalOpen, setIsOfferPaymentTypeModalOpen] = useState(false);
  const [isSuccessfulPaymentModalOpen, setIsSuccessfulPaymentModalOpen] = useState(false);
  const [isFailedlPaymentModalOpen, setIsFailedPaymentModalOpen] = useState(false);
  const [isOfferQRCodeModalOpen, setIsOfferQRCodeModalOpen] = useState(false);
  const [isPaymentRequestModalOpen, setIsPaymentRequestModalOpen] = useState(false);
  const [isSharePaymentRequestModalOpen, setIsSharePaymentRequestModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);
  const [bolt12Offer, setBolt12Offer] = useState(null);
  const [inbound, setInbound] = useState(null);
  const [outbound, setOutbound] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [invoiceString, setInvoiceString] = useState('');
  const [btcPrice, setBtcPrice] = useState(null);
  const [feeCredit, setFeeCredit] = useState(null);
  const [balanceOnly, setBalanceOnly] = useState(null);
  const [failedPaymentReason, setFailedPaymentReason] = useState('');
  useEffect(() => {

    fetch('api/getbalance')
      .then(res => res.json())
      .then(data => {
        setBalance(data);
        setFeeCredit(data.feeCreditSat)
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
      });

    fetch('api/getoffer')
      .then(res => res.json())
      .then(data => {
        setBolt12Offer(data);
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
      });
    fetch('api/getinfo')
      .then(res => res.json())
      .then(async data => {
        const balanceRes = await fetch('api/getbalance');
        const balanceData = await balanceRes.json();
        setBalanceOnly(balanceData);
        
        if (data.channels && data.channels.length > 0) {
          const channel = data.channels[0];
          setInbound(parseInt(channel.inboundLiquiditySat));
          setOutbound(parseInt(channel.balanceSat));
          setCapacity(parseInt(channel.capacitySat));
          setChannelId(channel.channelId);
        };

        try {
          const btcRes = await fetch('api/getbtcprice');
          const btcData = await btcRes.json();
          setBtcPrice(parseInt(btcData.btcPrice));
        } catch (err) {
          console.error('Error fetching BTC price:', err);
        }
      })
      .catch(err => console.error('Error getting node info:', err));

  }, []);

  const total = inbound + outbound;
  const inboundPercentage = total > 0 ? 100 - (inbound / total) * 100 : 0;

  const usdValue = (sats) =>
    btcPrice
      ? `≈ $${intlNumberFormat(((sats / 100000000) * btcPrice).toFixed(2))}`
      : '~';
  const openPaymentTypeModal = () => {
    setIsContactPaymentTypeModalOpen(false);
    setIsInvoicePaymentTypeModalOpen(false)
    setIsOfferPaymentTypeModalOpen(false)
    setIsPaymentTypeModalOpen(true);
  }
  const openContactPaymentTypeModal = () => {

    setTimeout(() => {
      setIsPaymentTypeModalOpen(false);
    }, 100)
    setIsContactPaymentTypeModalOpen(true);

  }
  const openInvoicePaymentTypeModal = () => {
    setTimeout(() => {
      setIsPaymentTypeModalOpen(false);
    }, 100)

    setIsInvoicePaymentTypeModalOpen(true);

  }

  const openOfferPaymentTypeModal = () => {
    setTimeout(() => {
      setIsPaymentTypeModalOpen(false);
    }, 100)
    setIsOfferPaymentTypeModalOpen(true);

  }

  const openOfferQRCodeModal = () => {
    setTimeout(() => {
      setIsPaymentTypeModalOpen(false);
    }, 100)
    setIsOfferQRCodeModalOpen(true);
  }

  const openSuccessfulPaymentModal = () => {
    setTimeout(() => {
      setIsContactPaymentTypeModalOpen(false);
      setIsInvoicePaymentTypeModalOpen(false)
      setIsOfferPaymentTypeModalOpen(false)
    }, 100)
    setIsSuccessfulPaymentModalOpen(true);
  }

  const handleFailedPayement = (reason) => {
    setFailedPaymentReason(reason || 'Payment failed.');
    setIsContactPaymentTypeModalOpen(false);
    setIsInvoicePaymentTypeModalOpen(false)
    setIsFailedPaymentModalOpen(true);
  }
  const openPaymentRequestModal = () => {
    setIsPaymentRequestModalOpen(true)
  }

  const closeModal = () => {
    setIsPaymentTypeModalOpen(false);
    setIsContactPaymentTypeModalOpen(false);
    setIsInvoicePaymentTypeModalOpen(false)
    setIsOfferPaymentTypeModalOpen(false)
    setIsSuccessfulPaymentModalOpen(false)
    setIsFailedPaymentModalOpen(false)
    setIsOfferQRCodeModalOpen(false)
    setIsPaymentRequestModalOpen(false)
    setIsSharePaymentRequestModalOpen(false)
  }

  const handleCopyClick = (text, ItemId) => {
    handleCopy(text, () => {
      setCopied(ItemId);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleInvoiceCreated = (invoiceString) => {
    setInvoiceString(invoiceString);
    setIsPaymentRequestModalOpen(false);
    setIsSharePaymentRequestModalOpen(true);
  };

  return (
    <>
      <div className="heading-home">Home</div>
      <div className="heading">Balance</div>
      <div className="balanceRow">
        <div className="col balanceCol">
          <button id="sendButton" onClick={openPaymentTypeModal}>Send <i className="bi bi-arrow-up-right"></i></button>
          {balance ? (
            <p className="balance">{intlNumberFormat(balance.balanceSat)} sats</p>
          ) : (
            <p className="balance">...</p>
          )}
          <button id="receiveButton" onClick={openPaymentRequestModal}><i className="bi bi-arrow-down-left"></i> Receive</button>
        </div>
      </div>

      <div className="heading">Liquidity</div>
      {channelId ? (
        <>
          <div className="balanceRow">
            <div className="progressBarContainer">
              <div id="progressBar" style={{ width: `${inboundPercentage}%` }}></div>
            </div>

            <div className="col balanceCol">
              <div className="balanceValue balanceItem">
                <p>Outbound <i className="bi bi-arrow-right"></i></p>
                <p className="outbound">{intlNumberFormat(outbound)} sats</p>
                <p id="btcPriceOutbound">You can send {usdValue(outbound)}</p>
              </div>

              <div className="balanceValue balanceItem">
                <p>Acinq</p>
                <p className="acinq">{intlNumberFormat(capacity)} sats</p>
                <span className="channelId" id="channelId">
                  <span className="channelIdString">{channelId}</span>
                  <button className="copy-btn" id="channelIdStr" onClick={() => handleCopyClick(channelId, "channelId")}>
                    {copied === "channelId" ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-copy"></i>
                    )}
                  </button>
                </span>
              </div>

              <div className="balanceValue balanceItem">
                <p className="inbound-styling">
                  <i className="bi bi-arrow-left"></i> Inbound
                </p>
                <p className="inbound-styling inbound">{intlNumberFormat(inbound)} sats</p>
                <p id="btcPriceInbound">You can recieve {usdValue(inbound)}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="balanceRow">
            <div className="progressBarContainer">
              <div id="progressBar"></div>
            </div>

            <div className="col balanceCol">
              <div className="balanceValue balanceItem">
                <p>Outbound <i className="bi bi-arrow-right"></i></p>
                <p className="outbound"></p>
                <p id="btcPriceOutbound"></p>
              </div>

              <div className="balanceValue balanceItem">
                <p>Acinq</p>
                <p className="acinq"></p>
                {
                  feeCredit ?
                    (
                      <>
                        <span className="channelId" id="channelId">
                          No channel created. Your fee credit sat amount is{' '}
                          {intlNumberFormat(feeCredit) || intlNumberFormat(balanceOnly?.feeCreditSat)}.
                          <br />
                          <a
                            href="https://phoenix.acinq.co/server/auto-liquidity"
                            target="_blank"
                            rel="noreferrer"
                            className="learn-more-link"
                          >
                            *Learn more about Phoenix auto-liquidity
                          </a>
                        </span>
                      </>
                    )
                    :
                    (
                      <>
                        <span className="channelId" id="channelId">
                          No channel created. Your fee credit sat amount is {'~'}
                          <br />
                          <a
                            href="https://phoenix.acinq.co/server/auto-liquidity"
                            target="_blank"
                            rel="noreferrer"
                            className="learn-more-link"
                          >
                            *Learn more about Phoenix auto-liquidity
                          </a>
                        </span>
                      </>
                    )
                }
              </div>

              <div className="balanceValue balanceItem">
                <p className="inbound-styling">
                  <i className="bi bi-arrow-left"></i> Inbound
                </p>
                <p className="inbound-styling inbound"></p>
                <p id="btcPriceInbound"></p>
              </div>
            </div>
          </div>
        </>

      )}

      <div className="row">
        <div className="col">
          <div className="heading">Offers</div>
          <p>This is your node's Bolt12 offer. A static and reusable payment request that does not expire</p>
          <div className="stringBox">
            {bolt12Offer ? (
              <>
                <span className="bolt12Offer" id="bolt12Offer">{bolt12Offer}</span>
                <span className="icons">
                  <button id="copyOffer" className="copy-btn" onClick={() => handleCopyClick(bolt12Offer, "copyOffer")}>
                    {copied === "copyOffer" ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-copy"></i>
                    )}
                  </button>
                  <button id="showOfferQR" className="copy-btn" onClick={openOfferQRCodeModal}>
                    <i className="bi bi-qr-code copy-btn"></i>
                  </button>
                  <button id="downloadOffer" className="copy-btn" onClick={handleBoltOfferDownload('bolt12-offer.txt', bolt12Offer)}>
                    <i className="bi bi-download copy-btn"></i>
                  </button>
                </span>
              </>
            ) : (
              <>
                <span className="bolt12Offer" id="bolt12Offer"></span>
                <span className="icons">
                  <button id="copyOffer" className="copy-btn">
                    <i className="bi bi-copy"></i>
                  </button>
                  <button id="showOfferQR" className="copy-btn" onClick={openOfferQRCodeModal}>
                    <i className="bi bi-qr-code copy-btn"></i>
                  </button>
                  <button id="downloadOffer" className="copy-btn">
                    <i className="bi bi-download copy-btn"></i>
                  </button>
                </span>
              </>
            )}

          </div>
        </div>
      </div>


      <ModalFade isOpen={isPaymentTypeModalOpen}>
        {isPaymentTypeModalOpen && (
          <PaymentTypeModal closeModal={closeModal}
            openContactTypePaymentModal={openContactPaymentTypeModal}
            openInvoiceTypePaymentModal={openInvoicePaymentTypeModal}
            openOfferTypePaymentModal={openOfferPaymentTypeModal}
          />
        )}
      </ModalFade>


      <ModalFade isOpen={isContactPaymentTypeModalOpen}>
        {isContactPaymentTypeModalOpen && (
          <ContactPaymentTypeModal closeModal={closeModal}
            openSuccessfulPaymentModal={openSuccessfulPaymentModal}
            openFailedPaymentModal={(reason) => handleFailedPayement(reason)}
            backToPaymentTypeModal={openPaymentTypeModal} />
        )}
      </ModalFade>


      <ModalFade isOpen={isInvoicePaymentTypeModalOpen}>
        {isInvoicePaymentTypeModalOpen && (
          <InvoicePaymentTypeModal closeModal={closeModal}
            openSuccessfulPaymentModal={openSuccessfulPaymentModal}
            openFailedPaymentModal={(reason) => handleFailedPayement(reason)}
            backToPaymentTypeModal={openPaymentTypeModal} />
        )}

      </ModalFade>

      <ModalFade isOpen={isOfferPaymentTypeModalOpen}>
        {isOfferPaymentTypeModalOpen && (
          <OfferPaymentTypeModal closeModal={closeModal}
            openSuccessfulPaymentModal={openSuccessfulPaymentModal}
            openFailedPaymentModal={(reason) => handleFailedPayement(reason)}
            backToPaymentTypeModal={openPaymentTypeModal} />
        )}
      </ModalFade>


      <ModalFade isOpen={isSuccessfulPaymentModalOpen}>
        {isSuccessfulPaymentModalOpen && (
          <SuccessfulPaymentModal closeModal={closeModal} />
        )}
      </ModalFade>


      <ModalFade isOpen={isFailedlPaymentModalOpen}>
        {isFailedlPaymentModalOpen && (
          <FailedPaymentModal closeModal={closeModal}
            errorMessage={failedPaymentReason} />
        )}
      </ModalFade>


      <ModalFade isOpen={isOfferQRCodeModalOpen}>

        {isOfferQRCodeModalOpen && (
          <OfferQRCodeModal closeModal={closeModal} bolt12String={bolt12Offer} />
        )}
      </ModalFade>

      <ModalFade isOpen={isPaymentRequestModalOpen}>
        {isPaymentRequestModalOpen && (
          <PaymentRequestModal closeModal={closeModal}
            onInvoiceCreated={(invoice) => handleInvoiceCreated(invoice)} />
        )}
      </ModalFade>

      <ModalFade isOpen={isSharePaymentRequestModalOpen}>
        {isSharePaymentRequestModalOpen && (
          <SharePaymentRequestModal closeModal={closeModal}
            invoiceString={invoiceString} />
        )}
      </ModalFade>

    </>
  );
};

export default Home;
