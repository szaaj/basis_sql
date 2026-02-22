-- SQL Quest - Improved Reizen Database
-- With PRIMARY KEY constraints and AUTO_INCREMENT

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- --------------------------------------------------------
-- Table: bestemming
-- --------------------------------------------------------

CREATE TABLE bestemming (
  idbestemming VARCHAR(5) PRIMARY KEY NOT NULL,
  plaats VARCHAR(25) DEFAULT NULL,
  land VARCHAR(25) DEFAULT NULL,
  werelddeel VARCHAR(20) DEFAULT NULL
);

INSERT INTO bestemming (idbestemming, plaats, land, werelddeel) VALUES
('ALANY', 'Alanya', 'Turkije', 'West-Europa'),
('ALEXA', 'Alexandrie', 'Egypte', 'Afrika'),
('ANTAL', 'Antalya', 'Turkije', 'West-Europa'),
('BAGHD', 'Baghdad', 'Irak', 'Azie'),
('BALI', 'Bali', 'Indonesie', 'Azie'),
('BANGK', 'Bangkok', 'Thailand', 'Azie'),
('BARCE', 'Barcelona', 'Spanje', 'West-Europa'),
('BASRA', 'Basra', 'Irak', 'Azie'),
('CAIRO', 'Cairo', 'Egypte', 'Afrika'),
('CORDO', 'Cordoba', 'Argentinie', 'Zuid-Amerika'),
('CORSI', 'Corsica', 'Frankrijk', 'West-Europa'),
('DUSSD', 'Dusseldorf', 'Duitsland', 'West-Europa'),
('GITES', 'Gitesdur', 'Frankrijk', 'West-Europa'),
('GRANC', 'Gran Canaria', 'Spanje', 'West-Europa'),
('HELSI', 'Helsinki', 'Finland', 'Noord-Europa'),
('ISTAN', 'Istanbul', 'Turkije', 'West-Europa'),
('LIMA', 'Lima', 'Peru', 'Zuid-Amerika'),
('MADRI', 'Madrid', 'Spanje', 'West-Europa'),
('MEDAN', 'Medan', 'Indonesie', 'Azie'),
('MIAMI', 'Miami', 'Verenigde Staten', 'Noord-Amerika'),
('MOIRA', 'Moirara', 'Spanje', 'West-Europa'),
('MONTE', 'Montevideo', 'Uruguay', 'Zuid-Amerika'),
('MONTR', 'Montreal', 'Canada', 'Noord-Amerika'),
('MOSUL', 'Mosul', 'Irak', 'Azie'),
('NEWOR', 'New Orleans', 'Verenigde Staten', 'Noord-Amerika'),
('OTTAW', 'Ottawa', 'Canada', 'Noord-Amerika'),
('PARIJ', 'Parijs', 'Frankrijk', 'West-Europa'),
('PATTA', 'Pattaya', 'Thailand', 'Azie'),
('RABAT', 'Rabat', 'Marokko', 'Afrika'),
('RECIF', 'Recife', 'Brazilie', 'Zuid-Amerika'),
('RIO', 'Rio de Janeiro', 'Brazilie', 'Zuid-Amerika'),
('SALOU', 'Salou', 'Spanje', 'West-Europa'),
('SANFR', 'San Francisco', 'Verenigde Staten', 'Noord-Amerika'),
('SANPA', 'San Pablo', 'Filippijnen', 'Azie'),
('SAOPA', 'Sao Paulo', 'Brazilie', 'Zuid-Amerika'),
('SURUB', 'Surubaya', 'Indonesie', 'Azie'),
('TANGE', 'Tanger', 'Marokko', 'Afrika'),
('THEBE', 'Thebes', 'Egypte', 'Afrika'),
('VERAC', 'Veracruz', 'Mexico', 'Noord-Amerika'),
('WASHI', 'Washington', 'Verenigde Staten', 'Noord-Amerika');

-- --------------------------------------------------------
-- Table: klant (with AUTO_INCREMENT starting at 35)
-- --------------------------------------------------------

CREATE TABLE klant (
  idklant INTEGER PRIMARY KEY AUTOINCREMENT,
  naam VARCHAR(50) DEFAULT NULL,
  adres VARCHAR(50) DEFAULT NULL,
  postcode VARCHAR(7) DEFAULT NULL,
  plaats VARCHAR(25) DEFAULT NULL,
  telefoon VARCHAR(15) DEFAULT NULL,
  email VARCHAR(50) DEFAULT NULL
);

INSERT INTO klant (idklant, naam, adres, postcode, plaats, telefoon, email) VALUES
(1, 'Jansen J.', 'Stationsstraat 25', '1001 AB', 'Amsterdam', '0612345678', 'j.jansen@email.com'),
(2, 'De Vries P.', 'Hoofdstraat 10', '3011 CD', 'Rotterdam', '0687654321', 'p.devries@email.com'),
(3, 'Bakker M.', 'Kerkstraat 5', '3511 EF', 'Utrecht', '0698765432', 'mbakker@email.com'),
(4, 'Smit A.', 'Dorpstraat 12', '2511 GH', 'Den Haag', '0656789012', 'asmit@email.com'),
(5, 'Visser K.', 'Marktplein 8', '5611 IJ', 'Eindhoven', '0634567890', 'kvisser@email.com'),
(6, 'Mulder L.', 'Schoolweg 20', '9711 KL', 'Groningen', '0645678901', 'lmulder@email.com'),
(7, 'De Jong T.', 'Kerkweg 15', '6511 MN', 'Nijmegen', '0656789012', 'tdejong@email.com'),
(8, 'Van Dijk R.', 'Molenstraat 30', '7511 OP', 'Enschede', '0667890123', 'rvandijk@email.com'),
(9, 'Peters S.', 'Boerderij 5', '8011 QR', 'Zwolle', '0678901234', 'speters@email.com'),
(10, 'Hendriks N.', 'Bosweg 18', '4811 ST', 'Breda', '0689012345', 'nhendriks@email.com'),
(11, 'Van Leeuwen B.', 'Nieuwe Straat 22', '5211 UV', 'Den Bosch', '0690123456', 'bvanleeuwen@email.com'),
(12, 'Hoekstra F.', 'Lindenlaan 7', '2011 WX', 'Haarlem', '0601234567', 'fhoekstra@email.com'),
(13, 'De Boer G.', 'Parkstraat 14', '3311 YZ', 'Dordrecht', '0612345678', 'gdeboer@email.com'),
(14, 'Brouwer E.', 'Ringweg 9', '6711 AA', 'Ede', '0623456789', 'ebrouwer@email.com'),
(15, 'Kok H.', 'Noordstraat 16', '1811 BB', 'Alkmaar', '0634567890', 'hkok@email.com'),
(16, 'Verhoeven I.', 'Zuidlaan 11', '4511 CC', 'Bergen op Zoom', '0645678901', 'iverhoeven@email.com'),
(17, 'Schouten J.', 'Oostweg 23', '7311 DD', 'Apeldoorn', '0656789012', 'jschouten@email.com'),
(18, 'Van den Berg C.', 'Weststraat 19', '8211 EE', 'Lelystad', '0667890123', 'cvandenberg@email.com'),
(19, 'Willems D.', 'Centrumplein 6', '5911 FF', 'Venlo', '0678901234', 'dwillems@email.com'),
(20, 'Maas V.', 'Lindelaan 28', '6211 GG', 'Maastricht', '0689012345', 'vmaas@email.com'),
(21, 'Van Vliet W.', 'Beukenlaan 13', '3811 HH', 'Amersfoort', '0690123456', 'wvanvliet@email.com'),
(22, 'Kuipers X.', 'Esdoornstraat 17', '2611 II', 'Delft', '0601234567', 'xkuipers@email.com'),
(23, 'Van der Meer Y.', 'Kastanjelaan 21', '1311 JJ', 'Almere', '0612345678', 'yvandermeer@email.com'),
(24, 'Dekker Z.', 'Populierweg 24', '4211 KK', 'Gorinchem', '0623456789', 'zdekker@email.com'),
(25, 'Jacobs Q.', 'Wilgenstraat 26', '7211 LL', 'Deventer', '0634567890', 'qjacobs@email.com'),
(26, 'Van der Veen O.', 'Iepenlaan 29', '9211 MM', 'Assen', '0645678901', 'ovanderveen@email.com'),
(27, 'Prins P.', 'Acaciastraat 31', '5011 NN', 'Tilburg', '0656789012', 'pprins@email.com'),
(28, 'Postma U.', 'Berkenweg 33', '8911 OO', 'Leeuwarden', '0667890123', 'upostma@email.com'),
(29, 'Vermeulen I.', 'Eikenlaan 35', '6811 PP', 'Arnhem', '0678901234', 'ivermeulen@email.com'),
(30, 'Van Dam O.', 'Notenlaan 37', '3211 QQ', 'Leiden', '0689012345', 'ovandam@email.com'),
(31, 'De Groot A.', 'Sparrenweg 39', '2211 RR', 'Katwijk', '0690123456', 'adegroot@email.com'),
(32, 'Jamers S.', 'Schorsstraat 282', '9067 KW', 'Tilburg', '0614565551', 'jamers@mail.com'),
(33, 'Bovenlander W.', 'Boschstraat 23', '9822 GL', 'Breda', '0644395068', 'Bovenlander@mail.com'),
(34, 'Lamers S.', 'Bosstraat 282', '9867 KW', 'Breda', '0614577551', 'lamers@mail.com');

-- Reset AUTO_INCREMENT to start at 35 for new inserts
-- (SQLite doesn't support ALTER TABLE ... AUTO_INCREMENT, it tracks automatically)

-- --------------------------------------------------------
-- Table: reis (with AUTO_INCREMENT starting at 29)
-- --------------------------------------------------------

CREATE TABLE reis (
  idreis INTEGER PRIMARY KEY AUTOINCREMENT,
  idbestemming VARCHAR(5) DEFAULT NULL,
  vertrekdatum DATE DEFAULT NULL,
  aantaldagen INTEGER DEFAULT NULL,
  prijsperpersoon DECIMAL(7,2) DEFAULT NULL,
  FOREIGN KEY (idbestemming) REFERENCES bestemming(idbestemming)
);

INSERT INTO reis (idreis, idbestemming, vertrekdatum, aantaldagen, prijsperpersoon) VALUES
(1, 'SANPA', '2017-03-12', 14, 1150.00),
(2, 'SANFR', '2017-03-17', 14, 1600.00),
(3, 'BALI', '2017-03-17', 21, 2150.00),
(4, 'CORSI', '2017-03-19', 23, 800.00),
(5, 'CORDO', '2017-04-20', 21, 2650.00),
(6, 'MADRI', '2017-04-20', 10, 700.00),
(7, 'SANPA', '2017-04-22', 23, 2450.00),
(8, 'RABAT', '2017-04-24', 12, 1385.00),
(9, 'TANGE', '2017-04-24', 23, 1825.00),
(10, 'VERAC', '2017-05-24', 14, 2450.00),
(11, 'MEDAN', '2017-05-27', 19, 2660.00),
(12, 'TANGE', '2017-05-30', 14, 1397.50),
(13, 'GRANC', '2017-05-03', 10, 650.00),
(14, 'ISTAN', '2017-05-04', 14, 1386.50),
(15, 'HELSI', '2017-05-04', 12, 1199.50),
(16, 'MIAMI', '2017-05-05', 23, 2945.00),
(17, 'RABAT', '2017-05-05', 14, 1475.00),
(18, 'RABAT', '2017-05-05', 21, 1795.00),
(19, 'GITES', '2017-05-10', 14, 1600.00),
(20, 'LIMA', '2017-06-10', 28, 3395.00),
(21, 'BANGK', '2017-06-10', 22, 2697.50),
(22, 'SURUB', '2017-06-12', 28, 3333.00),
(23, 'CAIRO', '2017-06-12', 8, 734.00),
(24, 'BARCE', '2017-06-12', 9, 620.00),
(25, 'DUSSD', '2017-06-13', 4, 420.00),
(26, 'MOIRA', '2017-06-13', 10, 815.00),
(27, 'MIAMI', '2017-06-15', 21, 2650.00),
(28, 'CORSI', '2017-06-15', 10, 1200.00);

-- --------------------------------------------------------
-- Table: boeking (with AUTO_INCREMENT starting at 52)
-- --------------------------------------------------------

CREATE TABLE boeking (
  idboeking INTEGER PRIMARY KEY AUTOINCREMENT,
  idklant INTEGER DEFAULT NULL,
  idreis INTEGER DEFAULT NULL,
  boekdatum DATE DEFAULT NULL,
  avolwassenen INTEGER DEFAULT NULL,
  akinderen INTEGER DEFAULT NULL,
  aanbetaling DECIMAL(6,2) DEFAULT NULL,
  FOREIGN KEY (idklant) REFERENCES klant(idklant),
  FOREIGN KEY (idreis) REFERENCES reis(idreis)
);

INSERT INTO boeking (idboeking, idklant, idreis, boekdatum, avolwassenen, akinderen, aanbetaling) VALUES
(1, 1, 1, '2019-03-20', 2, 2, 1500.00),
(2, 2, 2, '2019-03-20', 2, 0, 2000.00),
(3, 3, 3, '2019-03-21', 2, 1, 1900.00),
(4, 4, 4, '2019-03-21', 2, 0, 0.00),
(5, 5, 5, '2019-03-22', 2, 0, 2000.00),
(6, 6, 6, '2019-03-23', 4, 0, 0.00),
(7, 7, 7, '2019-03-23', 2, 3, 2500.00),
(8, 8, 8, '2019-03-24', 2, 0, 900.00),
(9, 9, 22, '2019-03-25', 2, 0, 1500.00),
(10, 10, 17, '2019-03-27', 5, 3, 2250.00),
(11, 14, 15, '2019-03-28', 4, 5, 0.00),
(12, 31, 10, '2019-03-29', 2, 0, 1600.00),
(13, 2, 10, '2019-04-02', 4, 1, 2250.00),
(14, 13, 20, '2019-04-02', 2, 0, 0.00),
(15, 3, 8, '2019-04-03', 3, 1, 2100.00),
(16, 7, 19, '2019-04-03', 2, 0, 0.00),
(17, 21, 24, '2019-04-04', 2, 1, 500.00),
(18, 18, 11, '2019-04-04', 4, 0, 0.00),
(19, 4, 26, '2019-04-05', 2, 3, 1150.00),
(20, 16, 28, '2019-04-05', 2, 1, 0.00),
(21, 19, 13, '2019-04-05', 3, 1, 0.00),
(22, 20, 21, '2019-04-06', 1, 0, 1250.00),
(23, 17, 21, '2019-04-06', 1, 0, 1250.00),
(24, 24, 7, '2019-05-23', 2, 0, 650.00),
(25, 25, 19, '2019-05-23', 1, 0, 0.00),
(26, 26, 17, '2019-05-23', 2, 1, 1150.00),
(27, 27, 9, '2019-05-23', 2, 0, 0.00),
(28, 28, 2, '2019-06-23', 1, 0, 1000.00),
(29, 29, 16, '2019-06-24', 2, 0, 2250.00),
(30, 11, 14, '2019-06-24', 2, 2, 0.00),
(31, 31, 21, '2019-07-24', 1, 0, 1250.00),
(32, 32, 22, '2019-07-25', 2, 0, 1500.00),
(33, 33, 17, '2019-07-27', 5, 3, 2250.00),
(34, 34, 15, '2019-07-28', 4, 5, 0.00),
(35, 24, 10, '2019-08-29', 2, 0, 1600.00),
(36, 24, 10, '2019-08-02', 4, 1, 2250.00),
(37, 26, 20, '2019-08-02', 2, 0, 0.00),
(38, 27, 8, '2019-08-03', 3, 1, 2100.00),
(39, 28, 19, '2019-09-03', 2, 0, 0.00),
(40, 29, 24, '2019-09-04', 2, 1, 500.00),
(41, 30, 11, '2019-09-04', 4, 0, 0.00),
(42, 34, 26, '2019-09-05', 2, 3, 1150.00),
(43, 31, 28, '2019-09-05', 2, 1, 0.00),
(44, 32, 13, '2019-09-05', 3, 1, 0.00),
(45, 33, 21, '2019-09-06', 1, 0, 1250.00),
(46, 30, 21, '2019-09-06', 1, 0, 1250.00),
(47, 15, 26, '2019-09-05', 2, 3, 1150.00),
(48, 4, 28, '2019-09-05', 2, 1, 0.00),
(49, 11, 13, '2019-09-05', 3, 1, 0.00),
(50, 18, 21, '2019-09-06', 1, 0, 1250.00),
(51, 19, 21, '2019-09-06', 1, 0, 1250.00);
