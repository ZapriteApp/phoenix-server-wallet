
$(document).ready(function () {
  $('#home-page').on('click', '#home', function () {
    $.ajax({
      url: 'views/partials/home.ejs',
      method: 'GET',
      success: function (html) {
        location.reload();
        $('#rightPanel').html(html);
      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });

  $('#home-page').on('click', '#transactions', function () {

    $.ajax({
      url: 'views/partials/transactions.ejs',
      method: 'GET',
      success: function (html) {
        
        $('#rightPanel').html(html);
        const itemsPerPage = 8;
        let currentPage = 1;
        let paymentsData = [];

        function renderTablePage(page) {
          const tableHtml = `
              <thead>
                  <tr>
                      <th></th>
                      <th>TimeStamp</th>
                      <th>Label</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Table rows will be inserted here by JavaScript -->
              </tbody>
          `; 
          const $tableContent = $('#paymentsTable');
          $tableContent.html(tableHtml)
          const $tableBody = $('#paymentsTable tbody');
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pageData = paymentsData.slice(startIndex, endIndex);
          $tableBody.empty();
          pageData.forEach(async function (payment) {
            let invoiceAmount, invoiceDescription;

            try {
                const invoiceDetails = await getInvoiceDetails(payment.invoice);
                if (invoiceDetails) {
                    invoiceAmount = invoiceDetails.amount / 1000;
                    invoiceDescription = invoiceDetails.description;
                } else {
                    invoiceAmount = "-";
                    invoiceDescription = "No description available"; // Fallback for description
                }
            } catch (error) {
                console.error("Error getting invoice details:", error);
                invoiceAmount = "-";
                invoiceDescription = "Error fetching description";
            }
            const transferITag = `<i class="bi bi-arrow-up-right"></i>`;
            const paymentITag = `<i class="bi bi-arrow-down-left"></i>`;
            const row = `
              <tr>
                  <td>${payment.hasOwnProperty("receivedSat") ? paymentITag : transferITag}</td>
                  <td>${formatTimestamp(payment.createdAt)}</td>
                  <td>${payment.hasOwnProperty("description") ? truncateText(payment.description) : invoiceDescription }</td>
                  <td>${payment.hasOwnProperty("receivedSat") ? invoiceAmount : payment.sent}</td>
                  <td>${payment.hasOwnProperty("receivedSat") ? "Payment" : "Transfer"}</td>
                  <td>${payment.isPaid ? 'Completed' : 'Uncompleted'}</td>
                  <td>
                    <button class="transaction-action-btn transaction-action-btn-icon" id="transaction-action" data-transaction='${JSON.stringify({
                        paymentHash: payment.paymentHash,
                        preimage: payment.preimage,
                        invoice: payment.invoice,
                        fees: payment.fees,
                        createdAt: payment.createdAt ? formatTimestamp(payment.createdAt) : "",
                        completedAt: payment.completedAt ? formatTimestamp(payment.completedAt) : "",
                        isPaid: payment.isPaid ? "Yes" : "No",
                        status: payment.isPaid ? 'Completed' : 'Uncompleted',
                        type: payment.hasOwnProperty("receivedSat") ? "Payment" : "Transfer",
                        //Outgoing
                        sent: payment.sent || null,
                        //Incoming
                        externalId: payment.externalId || null,
                        description: payment.description || null,
                        receivedSat: payment.receivedSat || null,
                        
                      })}'>
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                  </td>

              </tr>
          `;
          
            $tableBody.append(row);
          });
         
          updatePaginationControls(page);
        }

        function updatePaginationControls(page) {
          const totalPages = Math.ceil(paymentsData.length / itemsPerPage);
          $('#prevPage').prop('disabled', page <= 1);
          $('#nextPage').prop('disabled', page >= totalPages);

          const $pageInfo = $('#pageInfo');
          $pageInfo.text(`Page ${page} of ${totalPages}`);

          const $pageNumbers = $('#pageNumbers');
          $pageNumbers.empty();

          for (let i = 1; i <= totalPages; i++) {
            const pageButton = $('<button>')
              .text(i)
              .addClass('page-number-button')
              .prop('disabled', i === page)
              .click(function () {
                currentPage = i;
                renderTablePage(currentPage);
              });

            $pageNumbers.append(pageButton);
          }
        }

        function fetchData() {
          fetch(`/api/listincomingandoutgoing`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
            })
            .then(data => {
              paymentsData = data;
              renderTablePage(currentPage);
            })
            .catch(error => {
              console.error('Error fetching balance:', error);
            });
        }

        $(document).on("click", ".transaction-action-btn", function () {
          const transaction = $(this).data("transaction")
          const transactionData = $(this).data("transaction")// Parse transaction data
          const transactionDetailsGrid = $('#transactionDetailsGrid');
          transactionDetailsGrid.empty();
          $.each(transactionData, function (key, value) {
              if (value !== undefined && value !== null) {
                  // Create label div
                  const labelDiv = $('<div>').text(key).css(
                    {
                      'font-weight': 'bold',
                      'color': '#f19528'  
                    }
                  );
                  transactionDetailsGrid.append(labelDiv);
  
                  // Create value div
                  const valueDiv = $('<div>').text(value);
                  transactionDetailsGrid.append(valueDiv);
              }
          });
          $("#showTransactiontModal").on("click", "#doneTransactionModal", function () {
            $("#showTransactiontModal").fadeOut();
          });

          $("#showTransactiontModal").on("click", "#doneTransactionModal", function () {
            $("#showTransactiontModal").fadeOut();
          });
          //   // Show modal
          $("#showTransactiontModal").fadeIn();
          console.log(transaction);
        });

        $('#prevPage').click(function () {
          if (currentPage > 1) {
            currentPage--;
            renderTablePage(currentPage);
          }
        });

        $('#nextPage').click(function () {
          const totalPages = Math.ceil(paymentsData.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            renderTablePage(currentPage);
          }
        });

        fetchData();

      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });

  $('#home-page').on('click', '#contacts', function () {
    event.preventDefault();
    $.ajax({
      url: 'views/partials/contacts.ejs',
      method: 'GET',
      success: function (html) {
        $('#rightPanel').html('');
        $('#rightPanel').html(html);
        const itemsPerPage = 8;
        let currentPage = 1;
        let contactsData = [];

        function renderTablePage(page) {
          const contactsTableHtml = `
            <thead>
              <tr>
                  <th>Date Added</th>
                  <th>Label </th>
                  <th>Offer</th>
                  <th>Lightning Address</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                <!-- Table rows will be inserted here by JavaScript -->
            </tbody>
          `;
          const $contactsTableContents = $('#contactsTable')
          $contactsTableContents.html(contactsTableHtml)
          const $tableBody = $('#contactsTable tbody');
          $tableBody.empty();
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pageData = contactsData.slice(startIndex, endIndex);

          pageData.forEach(function (contact) {
            const row = `
              <tr>
                  <td>${new Date(contact.dateAdded).toLocaleDateString()}</td>
                  <td>${truncateText(contact.name, 15)}</td>
                  <td>${truncateText(contact.offer, 20)}</td>
                  <td>${truncateText(contact.address, 20)}</td>
                  <td>Active</td>
                  <td>
                    <button class="contact-action-btn contact-action-btn-icon" id="contact-action" data-contact='${JSON.stringify({
                      id: contact.id,
                      name: contact.name,
                      offer: contact.offer,
                      address: contact.address,
                      dateAdded: formatTimestamp(contact.dateAdded)
                    })}'>
                    <i class="bi bi-three-dots-vertical"></i>
                    </button>
                  </td>
              </tr>
          `;
            $tableBody.append(row);
          });

          updatePaginationControls(page);
        }
        function updatePaginationControls(page) {
          const totalPages = Math.ceil(contactsData.length / itemsPerPage);
          $('#prevPage').prop('disabled', page <= 1);
          $('#nextPage').prop('disabled', page >= totalPages);

          const $pageInfo = $('#pageInfo');
          $pageInfo.text(`Page ${page} of ${totalPages}`);

          const $pageNumbers = $('#pageNumbers');
          $pageNumbers.empty();

          for (let i = 1; i <= totalPages; i++) {
            const pageButton = $('<button>')
              .text(i)
              .addClass('page-number-button')
              .prop('disabled', i === page)
              .click(function () {
                currentPage = i;
                renderTablePage(currentPage);
              });

            $pageNumbers.append(pageButton);
          }
        }

        function fetchData() {
          fetch(`/api/getcontacts`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
            })
            .then(data => {
              contactsData = data.contacts;
              renderTablePage(currentPage);
            })
            .catch(error => {
              console.error('Error fetching balance:', error);
            });

        }

        $(document).on("click", ".contact-action-btn", function () {
          const contact = $(this).data("contact")
          const contactData = $(this).data("contact")
          const contactDetailsGrid = $('#contactDetailsGrid');
          contactDetailsGrid.empty();
          $.each(contactData, function (key, value) {
              if (value !== undefined && value !== null) {
                  // Create label div
                  const labelDiv = $('<div>').text(key).css(
                    {
                      'font-weight': 'bold',
                      'color': '#f19528'  
                    }
                  );
                  contactDetailsGrid.append(labelDiv);
  
                  // Create value div
                  const valueDiv = $('<div>').text(value);
                  contactDetailsGrid.append(valueDiv);
              }
          });
          $("#showContactActionModal").on("click", "#doneContactActionModal", function () {
            $("#showContactActionModal").fadeOut();
          });

          $("#showContactActionModal").on("click", "#closeContactActionModal", function () {
            $("#showContactActionModal").fadeOut();
          });
          //   // Show modal
          $("#showContactActionModal").fadeIn();
          console.log(contact);
        });

        $('#prevPage').click(function () {
          if (currentPage > 1) {
            currentPage--;
            renderTablePage(currentPage);
          }
        });

        $('#nextPage').click(function () {
          const totalPages = Math.ceil(contactsData.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            renderTablePage(currentPage);
          }
        });

        fetchData();



      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });

  $('#home-page').on('click', '#settings', function () {
    $.ajax({
      url: 'views/partials/settings.ejs',
      method: 'GET',
      success: function (html) {
        $('#rightPanel').html(html);
        $('#seeAdminPassword').on('click', function() {
          $('#adminPassword').toggleClass('visible');
        })
      
        $('#seeRestrictedPassword').on('click', function() {
          $('#restrictedPassword').toggleClass('visible');
        })

        $('#seeWalletSeedPhrase').on('click', async function() {
          $('#wallet-seed-phrase').toggleClass('visible');
        })
      
        fetch('/api/getconfiginfo')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            let adminPassword = data.config["http-password"]
            let restrictedPassword = data.config["http-password-limited-access"]
            $('#adminPassword').html(adminPassword);
            $('#restrictedPassword').html(restrictedPassword);
      
          })
          .catch(error => {
            console.error('Error fetching balance:', error);
          });
      
          fetch('/api/getseedphrase')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            // console.log(response.json())
            return response.json();
          })
          .then(data => {
            $('#wallet-seed-phrase').html(data.seed);
      
          })
          .catch(error => {
            console.error('Error fetching balance:', error);
          });
          
      
        $('#copyAdminPassword').on('click', function () {
          copyPassword('#adminPassword');
        });
      
         $('#copyWalletSeedPhrase').on('click', function () {
          copyPassword('#wallet-seed-phrase');  
        });
      
        // Event listener for restricted password copy button
        $('#copyRestrictedPassword').on('click', function () {
          copyPassword('#restrictedPassword');
        });
      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });
});

$(document).ready(function () {
  let balance;
  fetch('/api/getbalance')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $('.balance').html(`${data.balanceSat} sats`);
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
});

// Update node details
$(document).ready(function () {
  let inboundLiquiditySat;
  let capacitySat;
  let balanceSat;
  let channelId;

  fetch('/api/getinfo')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if(!data.channels.length){
        console.log("No channels are set!")
        fetch('/api/getbalance')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          $('.balance').html(`${data.balanceSat} sats`);
          $('.channelId').html(`
            No channel created. Your fee credit sat amount is ${data.feeCreditSat}.<br>
            <a href="https://phoenix.acinq.co/server/auto-liquidity" target="_blank" class="learn-more-link"> *Learn more about Phoenix auto-liquidity</a>
        `);
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
        });
       
      

      }else {
        inboundLiquiditySat = data.channels[0].inboundLiquiditySat;
        capacitySat = data.channels[0].capacitySat;
        balanceSat = data.channels[0].balanceSat;
        channelId = data.channels[0].channelId;
  
        console.log(inboundLiquiditySat)
        console.log(capacitySat)
        console.log(balanceSat)
        console.log(channelId)
  
        $('.inbound').html(`${inboundLiquiditySat}`);
        $('.acinq').html(`${capacitySat} sats`);
        $('.outbound').html(`${balanceSat}`);
        $('.channelIdString').html(`${channelId}`);
  
        inboundLiquiditySat = parseInt(inboundLiquiditySat)
        capacitySat = parseInt(capacitySat)
        balanceSat = parseInt(balanceSat)
  
        let total = inboundLiquiditySat + balanceSat;
        let inboundPercentage = 100 - (inboundLiquiditySat / total) * 100;
  
  
        $('#progressBar').css('width', inboundPercentage + '%');
  
        fetch('/api/getbtcprice')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
  
            btcPrice = parseInt(data.btcPrice);
            let outBoundVal = (balanceSat / 100000000) * btcPrice
            let inBoundVal = (inboundLiquiditySat / 100000000) * btcPrice
  
            $('#btcPriceOutbound').html(`You can send &#8776 $${outBoundVal.toFixed(2)}`);
            $('#btcPriceInbound').html(`You can receive &#8776 $${inBoundVal.toFixed(2)}`);
  
  
          })
          .catch(error => {
            console.error('Error fetching balance:', error);
            $('#btcPriceOutbound').html(`You can send $ ~`);
            $('#btcPriceInbound').html(`You can receive $~`);
  
          });
  
      }

     

    })
    .catch(error => {
      console.error('Error getting node info:', error);
    });




});

//Send modal details
$(document).ready(function () {
  var $paymentTypeModal = $("#paymentTypeModal");
  var $invoicePaymentType = $("#invoicePaymentType");
  var $offerPaymentType = $("#offerPaymentType");
  var $contactPaymentType = $("#contactPaymentType");
  var $successfulPaymentModal = $("#successfulPaymentModal");
  var $failedPaymentModal = $("#failedPaymentModal");


  // Get the button that opens the modal
  var $sendButton = $("#sendButton");
  var $receiveButton = $("#receiveButton");

  // Get the <span> element that closes the modal
  var $span = $(".close").first();
  $(".close").on("click", function () {
    var modalId = $(this).data('modal');
    $("#" + modalId).hide();
  });

  // When the user clicks the button, open the modal
  $(".main-content").on("click", '#sendButton', function () {
    $paymentTypeModal.show();
  })


  // When the user clicks on <span> (x), close the modal
  $span.on("click", function () {
    $paymentTypeModal.hide();
  });

  // When the user clicks anywhere outside of the modal, close it
  $(window).on("click", function (event) {
    if ($(event.target).is($paymentTypeModal)) {
      $paymentTypeModal.hide();
    }
  });

  $("#invoicePaymentOption").click(function () {
    var value = $(this).data("value");
    $paymentTypeModal.hide();
    $invoicePaymentType.show();
  });

  $("#contactPaymentOption").click(function () {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $contactPaymentType.show()
  });

  $("#offerPaymentOption").click(function () {
    var value = $(this).data("value");
    console.log(value);
    $paymentTypeModal.hide();
    $offerPaymentType.show();
  });

  $("#cancelSendRequest").click(function () {
    $paymentTypeModal.hide();
  });

  $('#requestInvoice').on('input', function () {
    var invoice = $(this).val().trim();

    if (invoice !== "") {
      fetch('/api/decodeinvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice: invoice })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {

          if (data.description) {
            $('.decode-invoice .memo').eq(1).text(truncateText(`Payment to ${data.description}`));
          }

          if (data.amount) {
            $('.decode-invoice .invoiceAmount').eq(1).text(`${data.amount / 1000} sats`);
          }

          // if (data.extrahops[0][0]) {
          //   $('.decode-invoice .fees').eq(1).text(`${data.extraHops[0][0].feeBase / 1000} sats`);
          // }else{
          //   $('.decode-invoice .fees').eq(1).text(`- sats`);
          // }
          $('.decode-invoice').show();
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  });


  $("#invoicePaymentType").on("click", "#submitInvoice", async function () {
    console.log("Submit clicked")
    const invoice = $("#requestInvoice").val().trim();
    let amountSat = $("#requestInvoiceAmount").val();
    let errorMessage = $('#invoice-error-message');
    let paymentFailedErrorMessage = $('#failed-payment-error-message');
    amountSat = parseInt(amountSat)
    console.log(invoice);
    console.log(amountSat);


    if (invoice === "") {
      errorMessage.text("The request invoice cannot be empty.");
      errorMessage.show();
      return
    }

    try {
      let response = await fetch('/api/decodeinvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoice: invoice })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await response.json();

      if (data.amount) {

        fetch('/api/payinvoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amountSat, invoice })
        }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            // console.log(response.json());
            return response.json()
          }).then(data => {
            if(data.reason){
              $invoicePaymentType.hide();
              paymentFailedErrorMessage.text(capitalizeFirstLetter(data.reason))
              paymentFailedErrorMessage.show()
              $failedPaymentModal.show();
            }else{
              $invoicePaymentType.hide();
              $successfulPaymentModal.show();
              $("#requestInvoice").val("");
              $('.decode-invoice').show();
            }
            console.log(data)
          })

        
      } else {
        errorMessage.text("The request invoice is not decodable.");
        errorMessage.show();
        return false;
      }
    } catch (error) {
      errorMessage.text("An error occurred while validating the invoice.");
      errorMessage.show();
      return false;
    }

    $("#requestInvoice").val(" ");

  });

  $("#invoicePaymentType").on("click", "#backToPaymentType", function () {
    $invoicePaymentType.hide();
    $paymentTypeModal.show()
  })

  $("#offerPaymentType").on("click", "#submitOffer", async function () {
    console.log("Offer button clicked")
    const offer = $("#requestOffer").val().trim();
    const rawAmount = $("#offerAmount").val().trim();
    const amountSat = $("#offerAmount").val().trim();
    const message = $("#offerDescription").val().trim();
    let errorMessage = $('#offer-error-message');
    let paymentFailedErrorMessage = $('#failed-payment-error-message');
    console.log(offer);
    console.log(amountSat);
    console.log(message);


    if (rawAmount === "") {
      errorMessage.text("Amount cannot be empty.");
      errorMessage.show();
      return
    }

    if (!/^\d+$/.test(rawAmount)) {
      errorMessage.text("Amount should be number.");
      errorMessage.show();
      return
    }

    if (offer === "") {
      errorMessage.text("Offer cannot be empty.");
      errorMessage.show();
      return
    }

    try {
      let response = await fetch('/api/decodeoffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offer: offer })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await response.json();

      if (data.chain) {
        fetch('/api/payoffer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amountSat, offer, message })
        }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json()
          }).then(data => {
            if(data.reason){
              $offerPaymentType.hide();
              paymentFailedErrorMessage.text(capitalizeFirstLetter(data.reason))
              paymentFailedErrorMessage.show()
              $failedPaymentModal.show();
            }else{
              $offerPaymentType.hide();
              $successfulPaymentModal.show();
              $("#requestOffer").val("");
              $("#offerAmount").val("");
              $("#offerDesription").val("");
            }
            console.log(data)
          })

      } else {
        errorMessage.text("The request offer is not decodable.");
        errorMessage.show();
        return false;
      }
    } catch (error) {
      errorMessage.text("An error occurred while decoding the invoice.");
      errorMessage.show();
      return false;
    }

    // $offerPaymentType.hide();
    // $successfulPaymentModal.show();

    $("#requestOffer").val("");
    $("#offerAmount").val("");
    $("#offerDesription").val("");
  });

  $("#offerPaymentType").on("click", "#backToPaymentType", function () {
    $offerPaymentType.hide();
    $paymentTypeModal.show()

  })

  $("#contactPaymentType").on("click", "#submitContact", async function () {
    console.log("Pay contact button clicked")
    const contactIdRaw = $("#paymentContact").val();
    let errorMessage = $('#contact-error-message');
    let paymentFailedErrorMessage = $('#failed-payment-error-message');
    let contactOffer;
    if (contactIdRaw == null) {
      errorMessage.text("You have not selected a contact.");
      errorMessage.show();
      return
    }

    const contactId = $("#paymentContact").val().trim();

    let rawAmount = $("#contactPaymentAmount").val().trim();

    const message = $("#contactPaymentDescription").val().trim();

    console.log(contactId);
    console.log(` Raw amount is ${rawAmount}`);
    console.log(message);

    offer = await getContactOffer(contactId)

    if (contactId === "") {
      errorMessage.text("You have not selected a contact.");
      errorMessage.show();
      return
    }

    if (rawAmount === "") {
      errorMessage.text("Amount cannot be empty.");
      errorMessage.show();
      return
    }

    if (!/^\d+$/.test(rawAmount)) {
      errorMessage.text("Amount should be number.");
      errorMessage.show();
      return
    }
    const amountSat = parseInt(rawAmount);
    console.log(` Amount sat is ${amountSat}`);

    console.log(amountSat);
    console.log(message);

    fetch('/api/payoffer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amountSat, offer, message })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json()
      }).then(data => {
        if(data.reason){
          $contactPaymentType.hide();
          paymentFailedErrorMessage.text(capitalizeFirstLetter(data.reason))
          paymentFailedErrorMessage.show()
          $failedPaymentModal.show();
        }else{
          $contactPaymentType.hide();
          $successfulPaymentModal.show();
        }

      })

    $("#contactPaymentDescription").val(" ");
    $("#contactPaymentAmount").val(" ");
    $("#paymentContact").val(" ");

  })

  $("#contactPaymentType").on("click", "#backToPaymentType", function () {
    $contactPaymentType.hide();
    $paymentTypeModal.show()

  })

  $("#successfulPaymentModal").on("click", "#submitPaymentSuccess", function () {
    console.log("Submit clicked")
    $successfulPaymentModal.hide();
  });

  $("#failedPaymentModal").on("click", "#okFailedPayment", function () {
    console.log("Failed button clicked")
    $failedPaymentModal.hide();
  });

})

$(document).ready(function () {
  // Get the button that opens the modal
  var $paymentRequestModal = $("#paymentRequestModal");
  var $sharePaymentRequestModal = $("#sharePaymentRequestModal");

  // Get the <span> element that closes the modal
  var $span = $(".close").first();
  $(".close").on("click", function () {
    var modalId = $(this).data('modal');
    $("#" + modalId).hide();
    $("#offerQRBarcode").empty();
    $("#barcode").empty();
    $("#importContactQRCode").empty();
  });

  $(".main-content").on("click", '#receiveButton', function () {
    $paymentRequestModal.show();
  })

  // When the user clicks on <span> (x), close the modal
  $span.on("click", function () {
    $paymentRequestModal.hide();
  });


  // When the user clicks anywhere outside of the modal, close it
  $(window).on("click", function (event) {
    if ($(event.target).is($paymentRequestModal)) {
      $paymentRequestModal.hide();
    }
  });

  $("#paymentRequestModal").on("click", "#nextToSharePaymentRequest", function () {
    console.log("Next to share payment button clicked")
    var amountSat = parseInt($("#requestInvoiceAmount").val().trim());
    var rawAmount = $("#requestInvoiceAmount").val().trim()
    var requestInvoiceName = $("#requestInvoiceName").val().trim();
    var requestInvoiceDescription = $("#requestInvoiceDescription").val().trim();
    const description = `${requestInvoiceName} - ${requestInvoiceDescription}`
    const webhookUrl = '';
    const externalId = '';

    let errorMessage = $('#payment-request-error-message');

    console.log(amountSat);
    console.log(description);

    if (rawAmount === "") {
      errorMessage.text("The request amount cannot be empty.");
      errorMessage.show();
      return
    }

    if (!/^\d+$/.test(rawAmount)) {
      errorMessage.text("Amount should be number.");
      errorMessage.show();
      return
    }

    fetch('/api/createinvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, amountSat, externalId, webhookUrl })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response);
        }
        return response.json();
      }).then(data => {
        $paymentRequestModal.hide();
        var invoiceString = data.serialized;
        $("#invoiceString").val(invoiceString);
        // // $('.invoice').html(`${data.serialized}`);
        new QRCode($("#barcode")[0], {
          text: invoiceString,
          width: 245,
          height: 245,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M,
        });

        $sharePaymentRequestModal.show();
        console.log(data);
        $("#requestInvoiceAmount").val("");
        $("#requestInvoiceName").val("");
        $("#requestInvoiceName").val("");

      })
  });

  $("#paymentRequestModal").on("click", "#cancelPaymentRequest", function () {
    console.log("Submit clicked");
    $paymentRequestModal.hide();
  });

  $('#sharePaymentRequestModal').on('click', '#doneSharePaymentRequest', function () {
    $sharePaymentRequestModal.hide();
    $("#barcode").empty();
    $.ajax({
      url: 'views/partials/transactions.ejs',
      method: 'GET',
      success: function (html) {
        $('#rightPanel').html(html);
      },
      error: function (xhr, status, error) {
        console.error('Error loading partial:', error);
      }
    });
  });


  $("#sharePaymentRequestModal").on("click", "#closeSharePaymentRequest", function () {
    console.log("Share Payment Request Modal closed")
    $("#barcode").empty();
    $sharePaymentRequestModal.hide();
  });

  $("#sharePaymentRequestModal").on("click", "#xSharePaymentRequest", function () {
    console.log("Share Payment Request Modal closed")
    $("#barcode").empty();
    $sharePaymentRequestModal.hide();
  });


})

$(document).ready(function () {
  $('#copyOffer').click(copyInvoice);
  let balance;
  fetch('/api/getoffer')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $('#bolt12Offer').html(`${data}`);
      // console.log(data);
    })
    .catch(error => {
      console.error('Error fetching offer:', error);
    });
});

$(document).ready(function () {
  $('.menu-item').click(function (e) {
    e.preventDefault();

    $('.menu-item').removeClass('selected');

    $(this).addClass('selected');
  });
})

$(document).ready(function () {
  var $addContactModal = $("#addContactModal");
  var $importContactModal = $("#importContactModal");
  let contacts = []

  $("#importContact").click(function () {
    console.log("Add contact modal clicked")

    fetch('/api/getoffer')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        new QRCode($("#importContactQRCode")[0], {
          text: data,
          width: 245,
          height: 245,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M,
        });
      })
      .catch(error => {
        console.error('Error fetching offer:', error);
      });

    $importContactModal.show();


  });

  $(".pagination").on("click", "#newContact", function () {
    console.log("Add contact modal clicked");
    $addContactModal.show();
  })


  $("#cancelAddContact").click(function () {
    $addContactModal.hide();
  });

  $('#closeContactModal').on("click", function () {
    $("#importContactQRCode").empty();
    contacts = []
    $importContactModal.hide();

  });

  $('#ximportContactModal').on("click", function () {
    $("#importContactQRCode").empty();
    contacts = []
    $importContactModal.hide();

  });

  $("#doneImportContactModal").click(function () {
    $("#importContactQRCode").empty();
    contacts = []
    $importContactModal.hide();

  });

  $("#addContact").on('click', async function () {
    const name = $("#addContactName").val().trim();
    const offer = $("#addContactOffer").val().trim();
    const address = $("#addContactAddress").val().trim();
    let errorMessage = $('#add-contact-error-message');

    if (name === "") {
      errorMessage.text("The contact name cannot be empty.");
      errorMessage.show();
      return
    }

    if (offer === "") {
      errorMessage.text("The contact offer cannot be empty.");
      errorMessage.show();
      return
    }

    let isValid = await isOfferValid(offer)
    if (!isValid) {
      console.log("Contact offer is invalid")
      errorMessage.text("The contact offer is invalid.");
      errorMessage.show();
      return
    }
    const contactData = {
      name: name,
      offer: offer,
      address: address
    }



    fetch('/api/savecontact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Contact saved:', data);
      })
      .catch(error => {
        console.error('Error saving contact:', error);
      });

    console.log(contactData)

    $addContactModal.hide();

  });
});

$(document).ready(function () {
  fetch(`/api/getcontacts`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $.each(data.contacts, function (index, contact) {
        $('#paymentContact').append(
          $('<option></option>').val(contact.id).text(contact.name)
        );
      });
    })
    .catch(error => {
      console.error('Error fetching contacts:', error);
    });
});

$(document).ready(function () {

  
  var $updatePasswordModal = $("#updatePasswordModal");
  var $failedConfirmSeedModal = $("#failedConfirmSeedModal");
  var $successPasswordSetModal = $("#successPasswordSetModal");
  var $confirmSeedPhraseModal = $("#confirmSeedPhraseModal")
  let errorMessage = $('#update-password-error-message');

  let randomNumberArr = generateRandomNumbers()

  $("#updatePassword").click(function () {
    
    
   
    $('.seed-form label').each(function(index) {
      $(this).text(`Seed Word ${randomNumberArr[index]}:`);
    });
    $confirmSeedPhraseModal.show();
  });


  $("#doneConfirmSeed").click(function () {
    console.log(randomNumberArr)
    let seed1 = $("#seed1").val().trim()
    let seed2 = $("#seed2").val().trim()
    let seed3 = $("#seed3").val().trim()
    let seed4 = $("#seed4").val().trim()

    let errorMessage = $('#seed-error-message');

    if (seed1 === "" || seed2 === "" || seed3 === "" || seed4 === "") {
      errorMessage.text("All fields are required. Please fill out all seeds.");
      errorMessage.show();
      return;
    }
    // let seedWordsInput = []
    // seedWordsInput.push(seed1, seed2, seed3, seed4)
    fetch('/api/getseedphrase')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      let seedWordsInput = []
      seedWordsInput.push(seed1, seed2, seed3, seed4)
      let confirmedSeedWords = []
      let seedStr = data.seed
      let walletSeedWords = seedStr.split(" ")
      confirmedSeedWords.push(walletSeedWords[randomNumberArr[0]-1], walletSeedWords[randomNumberArr[1]-1],
        walletSeedWords[randomNumberArr[2] - 1], walletSeedWords[randomNumberArr[3] - 1]
       )

       let allMatch = seedWordsInput.every((str, index) => str === confirmedSeedWords[index]);

       if (allMatch) {
         console.log("All strings match the array elements.");
         $confirmSeedPhraseModal.hide();
          $updatePasswordModal.show();
       } else {
        $confirmSeedPhraseModal.hide();
        $failedConfirmSeedModal.show()
       }

    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });

    $("#seed1").val("");
    $("#seed2").val("");
    $("#seed3").val("");
    $("#seed4").val("");
    randomNumberArr = []
    
  });

  $("#doneUpdatePassword").click(function () {
    var newPassword = $("#newPassword").val();
    var confirmedPassword = $("#confirmPassword").val();

    console.log("Update password clicked");
    console.log(confirmedPassword)
    console.log(newPassword)

    if (newPassword === "") {
      errorMessage.text("Missing new password!");
      errorMessage.show();
      return
    }

    if (confirmedPassword === "") {
      errorMessage.text("Missing confirmed password!");
      errorMessage.show();
      return
    }

    if (newPassword !== confirmedPassword) {
      errorMessage.text("Passwords do not match!");
      errorMessage.show();
      return
    }

    const password = {
      password: newPassword
    }


    fetch('/api/savepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(password)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Password saved:', data);
      })
      .catch(error => {
        console.error('Error saving password:', error);
      });

    $("#newPassword").val("");
    $("#confirmPassword").val("");
    $updatePasswordModal.hide();
    $successPasswordSetModal.show();
  });

  $("#submitSuccessPasswordSet").click(function () {
    $successPasswordSetModal.hide();
  });

  $("#cancelConfirmSeed").click(function () {
    $confirmSeedPhraseModal.hide();
  });

})

$(document).ready(function () {

  $(".main-content").on("click", '#showOfferQR', function () {
    const offerText = $('#bolt12Offer').text().trim();
    var $offerQRModal = $("#offerQRModal");
    $offerQRModal.show();
    new QRCode($("#offerQRBarcode")[0], {
      text: offerText,
      width: 245,
      height: 245,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });

    $("#doneShowPaymentOffer").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });
    

    $("#closeShowPaymentOffer").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });

    ("#xShowPaymentOffer").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });

    $(".close").click(function () {
      $offerQRModal.hide();
      $("#offerQRBarcode").empty();

    });
  })

})

$(document).ready(function () {
  const errorMessage = $('#login-error-message');

  $('#password').keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      $('#login-button  ').click();
    }
  });

  $('#login-button').click(async function (e) {
    e.preventDefault();
    const password = $('#password').val();
    console.log(password)

    if (!password) {
      errorMessage.text('Please enter a password');
      errorMessage.show();
      return;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
          // console.log("logging in")
        } else {
          errorMessage.text('Invalid password. Please try again.');
          errorMessage.show();
        }
      })
      .catch(error => {
        // Handle network errors
        console.error('Error:', error);
        errorMessage.text('An error occurred. Please try again.');
        errorMessage.show();
      });
  });

  fetch('/api/ispasswordset')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    
    if (data.success) {
      $('.passwordSet').html(`Password Set <i class="bi bi-check2"></i>`);
      $('#log-out').click(function (e) {
        logout()    
      })
    }
  })
  .catch(error => {
    console.error('Error fetching balance:', error);
  });

  fetch('http://localhost:3000/api/authenticate', {
    method: 'GET'
  })
    .then(response => {
      if (!response.ok) {
        console.log(response.status)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return null
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        if (window.location.pathname !== '/') {
          console.log("Redirecting to home");
          window.location.href = '/';
        }
      }
    })
    .catch(error => {
      console.log(error)
    });
})

$(document).ready(function () {
  $('#zaprite-link').on('click', function () {
    window.open("https://zaprite.com/");
  });

  $('#logout-link').on('click', function () {
    // window.location.href = url;
  });

  $('#github-link').on('click', function () {
    window.open("https://github.com/ZapriteApp/phoenix-server-wallet.git")
  });
})

$(document).ready(function () {
  


})


function loadPartial(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById('content').innerHTML = data;
    })
    .catch(error => console.error('Error loading partial:', error));
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 11 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}, ${hours}:${minutes}`;
}


function copyInvoice() {
  var $copyText = $("#invoiceString");
  $copyText.select();
  $copyText[0].setSelectionRange(0, 99999); // For mobile devices
  document.execCommand("copy");
}

function copyOffer() {
  var $copyText = $("#copyOffer").text();
  var $tempInput = $("<input>");
  $("body").append($tempInput);
  $tempInput.val($copyText).select();
  document.execCommand("copy");
  $tempInput.remove();
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

$('#exportCsv').on('click', () => {
  fetch(`/api/listincomingandoutgoing`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      var paymentsData = data;
      console.log(paymentsData)
      const csvRows = [];
      const headers = ['TimeStamp', 'Label', 'Amount', 'Type', 'Status'];
      csvRows.push(headers.join(','));
      paymentsData.forEach(payment => {
        const paymentITag = payment.hasOwnProperty("receivedSat") ? 'Payment' : 'Transfer';
        const status = payment.isPaid ? 'Completed' : 'Uncompleted';
        const row = [
          formatTimestamp(payment.createdAt),
          payment.hasOwnProperty("description") ? payment.description : "Label",
          payment.hasOwnProperty("receivedSat") ? payment.receivedSat : -payment.sent,
          paymentITag,
        ];
        csvRows.push(row.join(','));

      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const date = Date.now()
      a.download = `Phoenixd transactions(${formatTimestamp(date)}).csv`;
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });



});

$('#downloadOffer').on('click', function () {
  const offerText = $('#bolt12Offer').text().trim();
  if (offerText) {
    const blob = new Blob([offerText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = $('<a>').attr({
      href: url,
      download: 'bolt12_offer.txt'
    }).appendTo('body');
    a[0].click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } else {
    alert('No offer available to download.');
  }
});

$('#copyOffer').on('click', function () {
  const offerText = $('#bolt12Offer').text().trim();
  if (offerText) {
    const tempInput = $('<input>');
    $('body').append(tempInput);
    tempInput.val(offerText).select();
    document.execCommand('copy');
    tempInput.remove();
  } else {
    alert('No offer available to copy.');
  }
});

$('#copyChannelIdIcon').on('click', function () {
  const channelIdText = $('.channelIdString').text().trim();
  if (channelIdText) {
    const tempInput = $('<input>');
    $('body').append(tempInput);
    tempInput.val(channelIdText).select();
    document.execCommand('copy');
    tempInput.remove();
  } else {
    alert('No Id available to copy.');
  }
});

async function isOfferValid(offer) {
  try {
    let response = await fetch('/api/decodeoffer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ offer: offer })
    });

    if (!response.ok) {
      console.log("false")
      return false
    }
    let data = await response.json();
    return data.chain ? true : false;
  } catch (error) {
    console.error('Error checking offer validity:', error);
    return false;
  }
}
async function getContactOffer(contactId) {
  try {
    const response = await fetch('/api/getcontacts');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    const contactOffer = data.contacts.find(i => i.id == contactId)?.offer;
    return contactOffer;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return null;
  }
}

async function copyPassword(passwordId) {
  var passwordText = $(passwordId).text();
  var tempInput = $('<input>');
  $('body').append(tempInput);
  tempInput.val(passwordText).select();
  document.execCommand('copy');
  tempInput.remove();
}

function logout() {
  console.log("Logging out")
  fetch('/api/logout', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return null
        console.log("Logging out")
      } else {
          console.error('Logout failed:', data.message);
      }
  })
  .catch(error => {
      console.error('Error during logout:', error);
  });
}


function capitalizeFirstLetter(string) {
  if (string.length === 0) {
    return string;
  }

  return string[0].toUpperCase() + string.slice(1);
}

function generateRandomNumbers() {
  const numbers = [];
  while (numbers.length < 4) {
    const randomNumber = Math.floor(Math.random() * 12) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
}

function getInvoiceDetails(invoice) {
  return fetch('api/decodeinvoice', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invoice }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error decoding invoice');
      }
      return response.json();
  })
  .then(data => {
      return {
        amount: data.amount,
        description: data.description
      }
  })
  .catch(error => {
      console.error('Error:', error);
      return null; 
  });
}
