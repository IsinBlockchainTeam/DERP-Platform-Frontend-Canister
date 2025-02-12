import { LOCALE_IT } from "./cron_it";

export default {
    adminDashboard: {
        inviteSupplier: "Invita un'Azienda",
        inviteSupplierCaption:
            "Puoi invitare un'Azienda nel sistema condividendo il link di registrazione generato con questo pulsante. L'azienda si occuperà di definire le credenziali e le configurazioni per i suoi negozi.",
        generateLinkBtn: 'Genera Link',
        registerSupplier: 'Registra Azienda',
        registerSupplierCaption:
            "Puoi registrare un'azienda nel sistema aggiungendo manualmente le sue informazioni.",
        registerBtn: 'Registra',
        or: 'Oppure',
        supplierRegistration: {
            title: 'Registra Azienda',
            email: 'Email',
            submitBtn: 'Registra',
            errors: {
                email: "Inserisci un'email valida",
            },
            saveCredentials: {
                title: 'Salva Le Credenziali',
                email: 'Email',
                password: 'Password',
                description:
                    'Queste sono le credenziali del supplier, assicurati di salvarle in un posto sicuro, non potrai più vederle dopo aver completato questa fase.',
                continue: 'Continua',
            },
        },
        suppliersPage: {
            title: 'Aziende Registrate',
        },
        supplierDetails: {
            title: 'Dettagli Azienda',
            stores: 'Negozi',
            addStoreBtn: 'Aggiungi Negozio',
            addApiKeys: 'Aggiungi Chiavi API',
            generateKeys: 'Genera Chiave',
        },
        tabs: {
            merchants: 'Commercianti',
            resellers: 'Rivenditori'
        }
    },
    menu: {
        homepage: 'Home',
        orders: 'Ordini',
        stores: 'Negozi',
        invoices: 'Fatture',
        companyInfo: 'Anagrafica',
        interfaces: 'Interfacce',
    },
    adminMenu: {
        homepage: 'Home',
        suppliers: 'Aziende Registrate',
    },
    offers: {
        tableAlreadyOccupied: 'Il tavolo ha già un ordine attivo.',
        viewOpenOrderBtn: 'Visualizza Ordine',
        orderBtn: 'Ordina',
        noEmptyOrderCreation: 'Impossibile creare un ordine vuoto.',
        row: {
            id: 'ID',
            description: 'Descrizione',
            quantity: 'Quantità',
        },
    },
    paymentCanceled: {
        title: 'Pagamento Annullato',
        message:
            "Il pagamento è stato annullato. Chiudi questa finestra per tornare all'applicazione.",
        orStayInBrowser: 'O continua nel browser',
    },
    paymentFailed: {
        title: 'Pagamento Fallito',
        message:
            "Il pagamento è fallito. Chiudi questa finestra per tornare all'applicazione.",
        orStayInBrowser: 'O continua nel browser',
    },
    paymentSuccess: {
        title: 'Pagamento Riuscito',
        message:
            "Il pagamento è stato completato con successo. Chiudi questa finestra per tornare all'applicazione.",
        orStayInBrowser: 'O continua nel browser',
    },
    redirect: {
        willRedirectIn: 'Verrai reindirizzato in 3 secondi...',
    },
    report: {
        downloadBtn: 'Scarica',
        loadingCaption: 'Caricamento ...',
    },
    storeCreation: {
        admin: {
            fastRegisterStoreDescription:
                "Puoi registrare subito un negozio per il supplier oppure concludere la registrazione e lasciare che l'azienda si occupi di configurare i suoi negozi.",
            createStore: 'Crea Negozio Ora',
            finishRegistration: 'Concludi Registrazione',
        },
        errors: {
            name: 'Inserisci un nome valido',
            address: 'Inserisci un indirizzo valido',
            city: 'Inserisci una città valida',
            cap: 'Inserisci un CAP valido',
            erpUrl: 'Inserisci un URL ERP valido',
            erpUsername: 'Inserisci un nome utente ERP valido',
            erpPassword: 'Inserisci una password ERP valida',
            erpShopId: 'Inserisci un ID negozio ERP valido',
            privateKey: 'Inserisci una chiave privata valida',
            generalError:
                'Il sistema ha riscontrato un errore imprevisto, riprova più tardi',
            credentialsUrl: "Inserisci un URL per le credenziali valido",
            username: "Inserisci un nome utente valido",
        },
        tabs: {
            stores: 'Negozi',
            interfaces: 'Interfaccie',
            balance: 'Bilancio',
        },
        createNewStore: 'Crea un Negozio',
        changeStoreData: 'Modifica Dati Negozio',
        storeData: 'Dati Negozio',
        name: 'Nominativo',
        namePlaceholder: 'Hard Rock Cafe',
        address: 'Indirizzo',
        addressPlaceholder: 'via Roma 10',
        postalCodeAndLocation: 'CAP e Località',
        postalCodeAndLocationPlaceholder: '6900 Lugano',
        canton: 'CantonE',
        cantonPlaceholder: 'TI',
        additionalInfo: 'Altro',
        additionalInfoPlaceholder: 'Info aggiuntive...',
        country: 'Nazione',
        countryPlaceholder: 'CHE',
        privateKey: 'Chiave Privata Account Blockchain',
        privateKeyPlaceholder: '0x1234...',
        createBtn: 'Crea',
        updateBtn: 'Aggiorna',
        okBtn: 'Ok',
        loadingCreate: 'Creazione negozio',
        detailBtn: 'Dettagli',
        createStoreBtn: 'Crea Negozio',
    },
    storeData: {
        address: 'Indirizzo',
        city: 'Città',
        additionalInfo: 'Altro',
        postalCodeAndLocation: 'CAP e Località',
        canton: 'Cantone',
        country: 'Nazione',
        bcAddress: 'Indirizzo in Blockchain',
    },
    companyInfoForm: {
        companyInfoTitle: 'Anagrafica',
        businessName: 'Ragione sociale',
        email: 'Email',
        phone: 'Telefono',
        idi: 'IDI',
        vat: 'Iva',
        webSite: 'Sito web',
        representative: 'Referente',
        businessNamePlaceholder: 'Hard Rock Cafe',
        emailPlaceholder: 'hardrock@cafe.com',
        phonePlaceholder: '+123456789',
        idiPlaceholder: '123456789',
        vatPlaceholder: '123456789',
        webSitePlaceholder: 'https://hardrock.cafe',
        representativePlaceholder: 'somebody',
        updateBtn: 'Modifica',
    },
    saveCompanyInfo: {
        title: 'Anagrafica',
        subtitle:
            'È necessario compilare il seguente form per continuare la navigazione sul sito.',
        errors: {
            businessName: 'Inserisci una ragione sociale valida',
            email: "Inserisci un'email valida",
            phone: 'Inserisci un numero di telefono valido',
            idi: 'Inserisci un IDI valido',
            vat: 'Inserisci un numero di partita IVA valido',
            webSite: 'Inserisci un sito web valido',
            representative: 'Inserisci un referente valido',
        },
        btnSave: 'Salva',
    },
    updateCompanyInfo: {
        title: 'Anagrafica',
        errors: {
            businessName: 'Inserisci una ragione sociale valida',
            email: "Inserisci un'email valida",
            phone: 'Inserisci un numero di telefono valido',
            idi: 'Inserisci un IDI valido',
            vat: 'Inserisci un numero di partita IVA valido',
            webSite: 'Inserisci un sito web valido',
            representative: 'Inserisci un referente valido',
        },
        btnUpdate: 'Modifica',
    },
    storeDetails: {
        tabs: {
            data: 'Dati',
            tables: 'Tavoli',
            blockchains: 'Blockchain',
            appearance: 'Aspetto',
            suppliers: 'Fornitori',
            customers: 'Clienti',
            invoices: 'Fatture',
            transactions: 'Transazioni',
            dataSync: 'Sincronizzazione Dati',
            offers: 'Offerte',
            products: 'Prodotti',
            interfaces: 'Interfacce Associate'
        },
        closeBtn: 'Chiudi',
    },
    supplierDashboard: {
        tableLinkGenerator: 'Generatore QR Tavolo',
        tableLinkGeneratorCaption:
            'Puoi generare un codice QR con un link da utilizzare sui tuoi tavoli.',
        chooseStore: 'Scegli Negozio',
        selectStoreOption: 'Seleziona un negozio',
        table: 'Tavolo',
        generateLinkBtn: 'Genera Link',
        createNewStoreBtn: 'Crea Nuovo Negozio',
        createNewTableBtn: 'Crea Nuovo Tavolo',
    },
    supplierLogin: {
        title: 'Accedi alla dashboard',
        email: 'Email',
        password: 'Password',
        btnLogin: 'Accedi',
    },
    supplierSignup: {
        errors: {
            email: "Inserisci un'email valida",
            password: 'Inserisci una password valida',
            passwordConfirm: 'Le password non corrispondono',
        },
        title: 'Registrazione Azienda',
        email: 'Email',
        password: 'Password',
        passwordConfirm: 'Conferma Password',
        signupBtn: 'Registrati',
    },
    supplierOrders: {
        orderStatus: {
            draft: 'Bozza',
            ordered: 'Ordinato',
            confirmed: 'Confermato',
            closed: 'Chiuso',
            closedAndTransaction: 'Chiuso e Transazione',
        },
        dateFrom: 'Da',
        dateTo: 'A',
        clearFiltersBtn: 'Cancella Filtri',
        financialReportBtn: 'Report Finanziario',
        search: 'Cerca',
        searchPlaceholder: 'Cerca per oridini per negozio o stato',
        ordersTable: {
            id: 'ID',
            store: 'Negozio',
            table: 'Tavolo',
            status: 'Stato',
            date: 'Data',
            ERP: 'ERP',
            total: 'Totale',
            actions: 'Azioni',
        },
        orderPopup: {
            storeName: 'Nome Negozio',
            orderId: 'ID Ordine',
            showTransactionBtn: 'Mostra Transazione',
            accountingReportBtn: 'Report Contabile',
            paymentTransactions: 'Transazioni di Pagamento',
            transactionsTable: {
                transactionId: 'ID Transazione',
                bcStatus: 'Stato Blockchain',
                invoice: 'Fattura',
                bcExplorer: 'Esplora',
                verified: 'Verificato',
                notVerified: 'Non Verificato',
            },
            orderItems: 'Prodotti Ordine',
            itemsTable: {
                name: 'Nome',
                quantity: 'Quantità',
                price: 'Prezzo',
                bcExplorer: 'Esplora Blockchain',
            },
        },
    },
    supplierChains: {
        title: 'Blockchain',
        type: 'Tipo',
        id: 'ID',
        name: 'Nome',
        edit: 'Modifica',
        details: 'Dettagli',
        logo: 'Logo',
        nativeCoin: 'Moneta nativa',
        tokenCoin: 'Token ERC',
        noChains: 'Nessuna blockchain supportata',
        supportedCurrencies: 'Criptovalute Supportate',
        addCryptoBtn: 'Aggiungi Criptovaluta',
        addChainBtn: 'Aggiungi Blockchain',
        exchangeRate: 'Tasso di Cambio in CHF',
        addChain: {
            addSupportedChain: 'Aggiungi Blockchain Supportata',
            chainType: 'Tipo Blockchain',
            chainId: 'ID della Blockchain',
            chainName: 'Nome della Blockchain',
            chainRpcUrl: 'URL RPC della Blockchain',
            explorerUrl: 'URL per il Blockchain Explorer',
            payeeAddress: 'Indirizzo Ricevente Pagamenti',
            submitBtn: 'Aggiungi',
            invalidData:
                'Dati non validi! Per favore, controlla le informazioni inserite.',
        },
        addCrypto: {
            addSupportedCrypto: 'Aggiungi Criptovaluta Supportata',
            errors: {
                invalidData:
                    'Dati non validi! Per favore, controlla le informazioni inserite.',
                unknown:
                    'Errore sconosciuto durante la creazione, controlla le informazioni e riprova.',
            },
            cryptoName: 'Nome della Criptovaluta (ETH, BTC, ...)',
            isNative: 'Questa è la valuta nativa per la blockchain?',
            howManySwissFrancs:
                'Quanti franchi svizzeri vale 1 {{cryptoName}}?',
            smartContractAddress: 'Indirizzo Smart Contract del Token',
            cryptoConfiguration: 'Configurazione Criptovaluta',
            cancelBtn: 'Annulla',
            nextBtn: 'Avanti',
            logoConfiguration: 'Configurazione Logo',
            chooseNewLogo: 'Scegli un nuovo logo',
            chooseBtn: 'Scegli',
            doneBtn: 'Fatto',
        },
    },
    supplierDataSync: {
        title: 'Sincronizzazione Dati',
        subtitle: 'In questa pagina puoi personallizare la cadenza delle procedure asincrone per la creazione o importazione di risorse.',
        accountingTransactions: 'Transazioni Contabili',
        accountingTransactionsTab: {
            title: "Procedure per le Transazioni Contabili",
            subtitle: "Configura se e quanto frequentemente devono eseguire le procedure di sincronizzazione o creazione delle transazioni contabili.",
            addBtn: "Aggiungi Procedura",
            tableHeaders: {
                source: "Sorgente",
                enabled: "Abilitato",
                cron: "Specifica Cron",
                lastRun: "Ultima Esecuzione",
                nextRun: "Prossima Esecuzione",
                sources: {
                    internal: "Ordini DLTERP",
                    erp: "Transazioni ERP",
                    bank: "Transazioni Bancarie",
                    unknown: "Sconosciuto"
                },
            },
            form: {
                source: "Da quale sorgente di dati la procedura deve estrarre le transazioni?",
                sourceOptions: {
                    internal: "Genera dagli ordini in DLTERP",
                    erp: "Sincronizza dalle transazioni sul tuo ERP",
                    bank: "Sincronizza le transazioni dai tuoi conti bancari",
                    select: "Seleziona una sorgente...",
                },
                cron: "Con quanta frequenza deve eseguire la procedura?",
                cronLocale: LOCALE_IT,
                enabled: "La procedura sarà abilitata?",
                enabledLabel: "Abilita",
                cancel: "Annulla",
                submit: "Crea",
                update: "Aggiorna",
                nextTime: "Prossima Esecuzione",
                disabled: "La procedura è disabilitata",
                errors: {
                    source: "Seleziona una sorgente",
                    cron: "Inserisci una specifica cron valida",
                    interfaceMissingTmpl: "Questa procedura è forzatamente disabilitata. Per poterla abilitare, associa prima un'interfaccia di tipo {{type}} al negozio.",
                }
            },
        }
    },
    supplierTables: {
        addTable: {
            tableLabelPlaceholder: 'Etichetta Tavolo',
            erpUsernamePlaceholder: 'Nome Utente Account ERP',
            erpPasswordPlaceholder: 'Password Account ERP',
            confirmBtn: 'Conferma',
            cancelBtn: 'Annulla',
        },
        noRequiredAssociations: 'Per poter gestire i tavoli è necessario associare un\'interfaccia di tipo TCPOS al negozio',
        hereLink: 'qui',
        title: 'Tavoli',
        label: 'Etichetta',
        id: 'ID',
        noTables: 'Nessun tavolo trovato',
        insertTableData: 'Inserisci i Dati del Tavolo',
        closeCaption: 'Premi ESC o il bottone sottostante per chiudere',
        closeBtn: 'Chiudi',
        addBtn: 'Aggiungi Tavolo',
        qrViewTitle: 'Codice QR',
        qrViewCaption:
            'Stampa e posiziona questo codice QR sul tavolo per consentire ai clienti di effettuare ordini.',
        downloadQr: 'Scarica Codice QR',
    },
    supplierTransactions: {
        title: 'Transazioni Contabili',
        noTransactions: 'Nessuna transazione trovata',
        transactionsTable: {
            id: 'ID',
            source: 'Fonte',
            type: 'Tipo',
            // typekey?
            externalReference: 'Riferimento Esterno',
            issueDate: 'Data Emissione',
            valueDate: 'Data Valuta',
            total: 'Totale',
            currency: 'Valuta',
            status: 'Stato',
            description: 'Descrizione',
        },
        transactionDetails: {
            title: 'Transazione',
            downloadOriginal: 'Scarica XML originale'
        }
    },
    merchantOffers: {
        title: 'Offerte',
        description: 'Descrizione',
    },
    merchantBalance: {
        title: 'Bilancio',
        noCategories: 'Non sono ancora state configurate le categorie di bilancio.',
        settings: 'Impostazioni',
        uncategorized: 'Non categorizzato',
        balanceSettings: {
            title: 'Impostazioni Bilancio',
            year: 'Anno',
            chooseCategory: 'Scegli una categoria',
            categories: 'Categorie di Bilancio',
            items: 'Voci di Bilancio',
            addCategory: 'Aggiungi Categoria',
            addStatementItem: 'Aggiungi Voce',
            noCategorySelected: 'Please select a category to view the statement items',
            addCategoryModal: {
                title: 'Aggiungi Categoria',
                name: 'Nome Categoria',
                id: 'ID Categoria',
                submit: 'Invia',
                cancel: 'Annulla',
            },
            addItemModal: {
                title: 'Aggiungi Voce',
                id: 'ID Voce',
                name: 'Nome Voce',
                category: 'Categoria',
                currency: 'Divisa',
                submit: 'Invia',
                cancel: 'Annulla',
            },
            categoriesTable: {
                id: 'ID',
                name: 'Nome',
            },
            itemsTable: {
                id: 'ID',
                name: 'Nome',
                category: 'Categoria',
                currency: 'Divisa',
            }
        },
        table: {
            id: 'ID',
            currency: 'Divisa',
            total: 'Totale',
        }
    },
    supplierAppearance: {
        title: 'Aspetto',
        color: 'Colore',
        font: 'Carattere',
        logo: 'Logo',
        updateBtn: 'Aggiorna',
        chooseLogo: 'Scegli un nuovo logo',
        chooseBtn: 'Scegli',
    },
    supplierInvoices: {
        title: 'Fatture',
        noInvoices: 'Nessuna fattura trovata',
        invoicesTable: {
            idLabel: 'ID',
            issuedLabel: 'Emessa',
            expirationLabel: 'Scadenza',
            totalLabel: 'Totale',
            supplierLabel: 'Fornitore',
        },
    },
    temporaryInvoice: {
        rememberPaymentCredentials: 'Ricorda Credenziali Pagamento',
        noOrder: 'Nessun Ordine Disponibile',
        placeOrderBtn: 'Effettua un Ordine',
        loadingInvoice: 'Caricamento Fattura Ordine',
        loadingError: 'Errore Caricamento Documento',
        payBtn: 'Paga',
        cardNumber: 'Numero Carta',
        expiryDate: 'Data Scadenza',
        useCardBtn: 'Usa Carta',
        useAnotherCardBtn: "Usa un'altra Carta",
    },
    loading: 'Caricamento',
    downloadQr: 'Scarica Codice QR',
    copyQrLink: 'Copia Link QR',
    copiedToClipboard: 'Copiato negli appunti!',
    confirmPayment: {
        downloadBtn: 'Scarica Ricevuta',
        loadingCaption: 'Caricamento ...',
        row: {
            id: 'ID',
            description: 'Descrizione',
            quantity: 'Quantità',
        },
        paymentInfo: 'Informazioni di Pagamento',
        info: {
            transactionId: 'ID Transazione',
            type: 'Tipo',
            amount: 'Importo',
        },
        loadingError:
            "Errore durante il caricamento della pagina di conferma del pagamento, chiudi questa finestra per tornare all'applicazione.",
    },
    mySuppliers: {
        title: 'I Tuoi Fornitori',
        noFavSuppliers: 'Nessun fornitore aggiunto.',
        noSupplier: 'Nessun negozio ancora registrato al sistema.',
        showAll: 'Mostra Tutti',
        addSupplier: 'Aggiungi ai fornitori',
        removeSupplier: 'Rimuovi dai fornitori',
        removeSupplierDangerMessage:
            'Sei sicuro di voler rimuovere il negozio dai tuoi fornitori?',
        addInfo: 'Inserisci informazioni aggiuntive',
        cancel: 'Annulla',
        submit: 'Salva',
        extSupplierIDLabel: 'Il tuo ID cliente presso il fornitore',
        extSupplierIDDescription:
            'Ci serve sapere quale sia il tuo ID nel sistema del fornitore ',
    },
    myCustomers: {
        title: 'I Tuoi Clienti',
        noCustomersFound: 'Nessun negozio ti ha registrato come suo fornitore.',
    },
    confirmDialog: {
        confirm: 'Conferma',
        cancel: 'Indietro',
    },
    companyInfoCreation: {
        title: 'Anagrafica',
        subtitle:
            "Puoi inserire le informazioni dell'azienda oppure saltare questo step e lasciare che se ne occupi l'azienda.",
        btnContinue: 'Inserisci ora',
        btnSkip: 'Salta inserimento',
    },
    reseller: {
        tabs: {
            merchants: 'Commercianti'
        }
    },
    supplierInterfacesDashboard: {
        title: "Interfacce",
        wond: "Wond",
        wondCaption: "Gestisci le interfacce Wond.",
        wondButton: "Gestisci",
        kumo: "Kumo",
        kumoCaption: "Gestisci le interfacce Kumo.",
        kumoButton: "Gestisci",
        ebics: "Ebics",
        ebicsCaption: "Gestisci le interfacce Ebics.",
        ebicsButton: "Gestisci",
        interfaceName: 'Nome dell\'interfaccia',
        interfaceServerUrl: 'URL del server',
        interfaceUsername: 'Nome utente',
        interfacePassword: 'Password',
        pageDescription: 'Gestisci i sistemi esterni con i quali il tuo negozio può interfacciarsi.',
        addBtn: 'Aggiungi un\'interfaccia',
        delete: {
            title: 'Rimuovi interfaccia',
            message: 'Sei sicuro di voler rimuovere l\'interfaccia {{interfaceName}}? Questa azione non è reversibile',
            errorTitle: 'Errore durante la rimozione',
            errorMessage: 'L\interfaccia che stai cercando di eliminare è attualmente associata ad uno o più negozi. Rimuovi prima l\'associazione con i negozi e riprova.',
        },
        form: {
            cancel: 'Annulla',
            submitCreate: 'Crea',
            submitUpdate: 'Salva',
            createTitle: 'Aggiungi interfaccia',
            updateTitle: 'Aggiorna interfaccia',
            interfaceType: 'Tipo di interfaccia',
            interfaceTypeLabel: 'Scegli un tipo',
            typeEbics: 'EBICS - Sistema bancario',
            typeWond: 'WOND - Sistema e-commerce',
            typeKumo: 'Kumo - Sistema contabile',
            name: 'Nome dell\'interfaccia',
            url: 'URL del sistema',
            bank: {
                bankName: 'Nome della banca',
                partnerId: 'ID del partner',
                userId: 'ID dell\'utente',
                hostId: 'ID dell\'host',
                passphrase: 'Frase chiave',
                downloadLetter: {
                    title: 'Finalizza la configurazione EBICS',
                    message: 'Clicca il pulsante qui sotto per scaricare la lettera di autorizzazione EBICS. Questa lettera contiene le informazioni necessarie per stabilire la connessione tra la banca e il sistema. Dovrai stamparla, firmarla e inviarla alla tua banca. Contatta direttamente la banca per maggiori informazioni.',
                    downloadBtn: 'Scarica lettera',
                }
            },
            kumo: {
                username: 'Nome utente',
                password: 'Password',
            },
            wond: {
                wondType: 'Tipo di wond',
                typeLightspeed: 'Lightspeed',
                typeTcpos: 'TCPOS',
                tcpos: {
                    username: 'Nome utente',
                    password: 'Password'
                }
            },
            genericError: {
                title: 'Errore durante la richiesta',
                message: 'La richiesta non è stata completata per via del seguente errore. Contatta l\'amministrazione per piú dettagli.',
            }
        },
        actions: {
            manage: 'Gestisci'
        },
        table: {
            id: 'ID',
            name: 'Nome',
            type: 'Tipo',
        },
        associations: {
            title: 'Interfaccie Associate',
            addBtn: 'Associa interfaccia',
            noInterface: 'Non hai configurato interfaccie nella tua compagnia. Registra prima un\'interfaccia',
            noInterfaceLinkText: 'qui',
            form: {
                interfaceAssociation: 'Scegli l\'interfaccia da attivare in questo negozio',
                interfaceAssociationLabel: 'Scegli un interfaccia',
                type: 'Tipo di interfaccia',
                submitCreate: 'Crea',
                submitUpdate: 'Salva',
                cancel: 'Annulla',
                errors: {
                    type: 'Seleziona un tipo di interfaccia',
                    interfaceId: 'Seleziona un\'interfaccia valida',
                    alreadyExists: 'Questo negozio ha già un\'interfaccia di tipo {{type}} associata. Ogni negozio può avere solo un\'interfaccia di tipo {{type}}.',
                }
            },
            delete: {
                title: 'Rimuovi associazione',
                message: 'Sei sicuro di voler rimuovere l\'associazione con l\'interfaccia {{interfaceName}}? Questa azione non può essere annullata.',
            },
            table: {
                type: 'Tipo',
                interface: 'Interfaccia',
            },
            ebics: {
                noAdditionalInfo: 'L\'associazione di questa interfaccia non richiede informazioni aggiuntive',
            },
            kumo: {
                shopId: 'ID del negozio su Kumo (shopId)'
            },
            wond: {
                tcpos: {
                    shopId: 'ID del negozio su TCPOS (shopId)'
                }
            }
        }
    },
    adminReseller: {
        tabTitle: 'Riveditori',
        btnAdd: 'Aggiungi',
        registrationModalTitle: 'Registra una nuova azienda',
        registrationModalMessage: 'Per creare un nuova Azienda, è necessario registrare almeno un Utente.',
        editModalTitle: 'Gestione azienda e utenti',
    },
    adminMerchant: {
        tabTitle: 'Commercianti',
        btnAdd: 'Aggiungi',
        registrationModalTitle: 'Registra una nuova azienda',
        registrationModalMessage: 'Per creare un nuova Azienda, è necessario registrare almeno un Utente.',
        editModalTitle: 'Gestione azienda e utenti',
    },
    companiesTable: {
        businessName: 'Nominativo',
        additionalInfo: 'Altro',
        address: 'Indirizzo',
        postalCodeAndLocation: 'CAP e Località',
        canton: 'Cantone',
        country: 'Nazione',
        idi: 'Numero IDI',
        vat: 'Numero IVA',
        phone: 'Telefono',
        webSite: 'Web',
        email: 'Email',
    },
    genericTable: {
        actions: 'Azioni',
        noData: 'Non ci sono dati disponibili',
    },
    companyModalRegistration: {
        companyStep: 'Azienda',
        userStep: 'Rappresentante',
        cancel: 'Cancella',
        next: 'Successivo',
        back: 'Indietro',
        submit: 'Invia',
        company: {
            businessName: 'Nominativo',
            additionalInfo: 'Altro',
            address: 'Indirizzo',
            postalCodeAndLocation: 'CAP e Località',
            canton: 'Cantone',
            country: 'Nazione',
            idi: 'Numero IDI',
            vat: 'Numero IVA',
            phone: 'Telefono',
            webSite: 'Web',
            email: 'Email',
            labelBusinessName: 'Hard Rock Cafe',
            labelAdditionalInfo: 'Info...',
            labelAddress: 'via Roma 10',
            labelPostalCodeAndLocation: '6900 Lugano',
            labelCanton: 'TI',
            labelCountry: 'CHE',
            labelIdi: '123456789',
            labelVat: '123456789',
            labelPhone: '+123456789',
            labelWebSite: 'https://hardrock.cafe',
            labelEmail: 'hardrock@cafe'
        },
        user: {
            firstName: 'Nome',
            lastName: 'Cognome',
            roleFunction: 'Funzione',
            phone: 'Telefono',
            email: 'Email',
            username: 'Username',
            password: 'Password',
            status: 'Stato',
            labelFirstName: 'John',
            labelLastName: 'Doe',
            labelRoleFunction: 'CEO',
            labelPhone: '+123456789',
            labelEmail: 'john.doe@gmail.com',
            labelUsername: 'john.doe',
            labelPassword: '*****',
        },
        companyCreatedTitle: 'Nuova azienda registrata',
        backToDashboard: 'Torna alla dashboard',
    },
    companyEditModal: {
        companyTab: 'Aziende',
        userTab: 'Utenti',
        cancel: 'Annulla',
        submit: 'Invia',
        updatedCompanyTitle: 'Informazioni azienda',
        backToDashboard: 'Torna alla dashboard',
        company: {
            businessName: 'Nominativo',
            additionalInfo: 'Altro',
            address: 'Indirizzo',
            postalCodeAndLocation: 'CAP e Località',
            canton: 'Cantone',
            country: 'Nazione',
            idi: 'Numero IDI',
            vat: 'Numero IVA',
            phone: 'Telefono',
            webSite: 'Web',
            email: 'Email',
            labelBusinessName: 'Hard Rock Cafe',
            labelAdditionalInfo: 'Info...',
            labelAddress: 'via Roma 10',
            labelPostalCodeAndLocation: '6900 Lugano',
            labelCanton: 'TI',
            labelCountry: 'CHE',
            labelIdi: '123456789',
            labelVat: '123456789',
            labelPhone: '+123456789',
            labelWebSite: 'https://hardrock.cafe',
            labelEmail: 'hardrock@cafe',
            managedBy: 'Gestita da',
        },
        user: {
            firstName: 'Nome',
            lastName: 'Cognome',
            roleFunction: 'Funzione',
            phone: 'Telefono',
            email: 'Email',
            username: 'Username',
            password: 'Password',
            status: 'Stato',
            labelFirstName: 'John',
            labelLastName: 'Doe',
            labelRoleFunction: 'CEO',
            labelPhone: '+123456789',
            labelEmail: 'john.doe@gmail.com',
            labelUsername: 'john.doe',
            labelPassword: '*****',
            addUserTitle: 'Aggiungi nuovo utente',
            userListTitle: 'Lista utenti',
        },
    },
    storeModalRegistration: {
        storeCreationTitle: 'Crea un nuovo negozio',
        storeCreatedTitle: 'Nuovo negozio creato',
        storeForm: {
            businessName: 'Nominativo',
            additionalInfo: 'Altro',
            address: 'Indirizzo',
            postalCodeAndLocation: 'CAP e Località',
            canton: 'Cantone',
            country: 'Nazione',
            privateKey: 'Chiave Privata Account Blockchain',
            placeholderBusinessName: 'Hard Rock Cafe',
            placeholderAdditionalInfo: 'Info...',
            placeholderAddress: 'via Roma 10',
            placeholderPostalCodeAndLocation: '6900 Lugano',
            placeholderCanton: 'TI',
            placeholderCountry: 'CHE',
            placeholderPrivateKey: '0x1234...',
        },
        backToDashboard: 'Torna alla dashboard',
        cancel: 'Annulla',
        submit: 'Invia'
    },
    offerLinesPage: {
        description: "Descrizione",
        price: "Costo",
        quantity: "Quantità",
        productDescription: "Descrizione Prodotto",
    },
    merchantProducts: {
        title: "Prodotti",
        description: "Descrizione",
    }
};
