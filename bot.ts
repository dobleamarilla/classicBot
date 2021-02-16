const TelegramBot = require('node-telegram-bot-api');
const conexion = require('./conexion');
var sugar = require('sugar');
var dateFormat = require('dateformat');
const emoji = require('node-emoji');

let BotName = "";
var Token = '';
var datosImprimirListado = "";
var datosImprimirComandas = "";

BotName = process.argv[2];
if (BotName === undefined) BotName = "Cdp";

if (BotName == 'SecreHit') Token = process.env['BOT_TOKEN_SecreHit'];
if (BotName == 'Armengol') Token = process.env['BOT_TOKEN_Armengol'];
if (BotName == 'PaNatural') Token = process.env['BOT_TOKEN_PaNatural'];
if (BotName == '365Cafe') Token = process.env['BOT_TOKEN_365Cafe'];
if (BotName == 'FornCarne') Token = process.env['BOT_TOKEN_FornCarne'];
if (BotName == 'Cdp') Token = process.env['BOT_TOKEN_Cdp'];
if (BotName == 'test') Token = process.env['BOT_TOKEN_TEST'];

console.log(' Bot Name : ************************** ' + BotName + ' ************************** ');
const nombresDeDios = ",911219941,516979495,1126693304,";
//                    jordi    ,santi    ,sandra 

const bot = new TelegramBot(Token, { polling: true });

//	$arrayDias = array( 'Domingo', 'Lunes', 'Martes','Miercoles', 'Jueves', 'Viernes', 'Sabado');
let arrayDiasLL = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Disabte'];
let arrayDias = ['Dg', 'Dl', 'Dm', 'Dc', 'Dj', 'Dv', 'Ds'];
let arrayHores = ['\u{1F550}', '\u{1F551}', '\u{1F552}', '\u{1F553}', '\u{1F554}', '\u{1F555}', '\u{1F556}', '\u{1F557}', '\u{1F558}', '\u{1F559}', '\u{1F55A}', '\u{1F55B}', '\u{1F550}', '\u{1F551}', '\u{1F552}', '\u{1F553}', '\u{1F554}', '\u{1F555}', '\u{1F556}', '\u{1F557}', '\u{1F558}', '\u{1F559}', '\u{1F55A}', '\u{1F55B}'];

function registraUser(msg, Emp, NomEmp) {
	var Tel = msg.contact.phone_number;
	var IdC = msg.from.id;
	var Sql = '';

	Sql = "select d.codi Codi from ( ";
	Sql += "select id as codi from dependentesExtes where nom='TLF_MOBIL' and   ";
	Sql += "(valor = '" + msg.contact.phone_number + "' or '+34' + valor = '" + msg.contact.phone_number + "') union   ";
	Sql += "select id as codi from dependentesExtes where nom='TLF_MOBIL' and   ";
	Sql += "(valor = '" + msg.contact.phone_number + "' or '34' + valor = '" + msg.contact.phone_number + "') union   ";
	Sql += "select codi from dependentes where   ";
	Sql += "(telefon = '" + msg.contact.phone_number + "' or '+34' + telefon = '" + msg.contact.phone_number + "') union ";
	Sql += "select codi from dependentes where   ";
	Sql += "(telefon = '" + msg.contact.phone_number + "' or '34' + telefon = '" + msg.contact.phone_number + "') ";
	Sql += "	) a   ";
	Sql += "join dependentes d on d.codi = a.codi   ";
	conexion.recHit(Emp, Sql).then(info1 => {
		if (info1.rowsAffected > 0 && info1.recordset[0].Codi > 0) {
			var codiUser = info1.recordset[0].Codi;
			conexion.recHit('Hit', "Delete secretaria where Aux1 = '" + IdC + "' ").then(info2 => {
				conexion.recHit('Hit', "insert into secretaria (Id,lastConnect,empresa,usuario,Aux1) values (newid(),getdate(),'" + Emp + "','" + msg.contact.phone_number + "','" + IdC + "')").then(info3 => {
					conexion.recHit(Emp, "Select Nom from Dependentes where codi = " + codiUser + " ").then(info4 => {
						if (info4.rowsAffected > 0) {
							console.log('Enregistrat ' + info4.recordset[0].Nom + " a " + NomEmp);
							botsendMessage(msg, "Hola " + info4.recordset[0].Nom + " \n Benvingut a " + NomEmp + " ");
							CreaTaules(Emp);
						}
						else { BuscaMsgIdEmpresa(msg, NomEmp); };
					});
				});
			});
		} else { BuscaMsgIdEmpresa(msg, NomEmp); };
	});
}


function CreaTaules(Emp) {
	var Sql = '';
	Sql = "IF OBJECT_ID(N'CodigosDeAccion', N'U') IS NULL ";
	Sql += "BEGIN  ";
	Sql += "SET ANSI_NULLS ON ";
	Sql += "SET QUOTED_IDENTIFIER ON ";
	Sql += "CREATE TABLE [CodigosDeAccion]( ";
	Sql += "[IdCodigo] [nvarchar](255) NOT NULL, ";
	Sql += "[TmStmp] [datetime] NOT NULL, ";
	Sql += "[TipoCodigo] [nvarchar](255) NOT NULL, ";
	Sql += "[Param1] [nvarchar](255) NULL, ";
	Sql += "[Param2] [nvarchar](255) NULL, ";
	Sql += "[Param3] [nvarchar](255) NULL, ";
	Sql += "[Param4] [nvarchar](255) NULL, ";
	Sql += "[Param5] [nvarchar](255) NULL, ";
	Sql += "[Param6] [nvarchar](255) NULL, ";
	Sql += "[Param7] [nvarchar](255) NULL, ";
	Sql += "[Param8] [nvarchar](255) NULL, ";
	Sql += "[Param9] [nvarchar](255) NULL, ";
	Sql += "[Param10] [nvarchar](255) NULL ";
	Sql += ") ON [PRIMARY] ";
	Sql += "ALTER TABLE [dbo].[CodigosDeAccion] ADD  CONSTRAINT [DF_CodigosDeAccion_id]  DEFAULT (newid()) FOR [IdCodigo] ";
	Sql += "ALTER TABLE [dbo].[CodigosDeAccion] ADD  CONSTRAINT [DF_CodigosDeAccion_tmstmp]  DEFAULT (getdate()) FOR [TmStmp] ";
	Sql += "END 	 ";
	conexion.recHit(Emp, Sql).then(info => {
		Sql = "IF OBJECT_ID(N'Bot_Estat', N'U') IS NULL BEGIN ";
		Sql += "CREATE TABLE [dbo].[Bot_Estat]([id] [nvarchar](255) NULL,[TimeStamp] [datetime] NULL,[CodiUser] [nvarchar](255) NULL,[Variable] [nvarchar](255) NULL,[Valor] [nvarchar](255) NULL,[Texte] [nvarchar](255) NULL,[Auxiliar1] [nvarchar](255) NULL,[Auxiliar2] [nvarchar](255) NULL,[Auxiliar3] [nvarchar](255) NULL,[Auxiliar4] [nvarchar](255) NULL) ON [PRIMARY] ";
		Sql += "END; ";
		conexion.recHit(Emp, Sql).then(info => {
			Sql = "IF OBJECT_ID(N'TicketsTemporals', N'U') IS NULL BEGIN ";
			Sql += "SET ANSI_NULLS ON ";
			Sql += "SET QUOTED_IDENTIFIER ON ";
			Sql += "CREATE TABLE [dbo].[TicketsTemporals]( ";
			Sql += "[Id] [nvarchar](255) NULL, ";
			Sql += "[Rebut] [nvarchar](255) NULL, ";
			Sql += "[TmSt] [datetime] NULL, ";
			Sql += "[Botiga] [float] NULL, ";
			Sql += "[Dependenta] [float] NULL, ";
			Sql += "[Quantitat] [float] NULL, ";
			Sql += "[Cd] [float] NULL, ";
			Sql += "[Preu] [float] NULL, ";
			Sql += "[Comentari] [nvarchar](255) NULL, ";
			Sql += "[IdSincro] [nvarchar](255) NULL, ";
			Sql += "[Servit] [nvarchar](255) NULL ";
			Sql += ") ON [PRIMARY] ";
			Sql += "END; ";
			conexion.recHit(Emp, Sql).then(info => {
				Sql = "IF OBJECT_ID(N'incidencias', N'U') IS NULL BEGIN ";
				Sql += "SET ANSI_NULLS ON ";
				Sql += "SET QUOTED_IDENTIFIER ON ";
				Sql += "CREATE TABLE [dbo].[incidencias]( ";
				Sql += "[Id] [numeric](18, 0) IDENTITY(1,1) NOT FOR REPLICATION NOT NULL, ";
				Sql += "[TimeStamp] [datetime] NULL, ";
				Sql += "[Cliente] [nvarchar](255) NULL, ";
				Sql += "[Recurso] [nvarchar](255) NULL, ";
				Sql += "[Incidencia] [nvarchar](2500) NULL, ";
				Sql += "[Estado] [nvarchar](50) NULL, ";
				Sql += "[Observaciones] [nvarchar](2500) NULL, ";
				Sql += "[Prioridad] [numeric](2, 0) NULL, ";
				Sql += "[Tecnico] [int] NULL, ";
				Sql += "[Usuario] [int] NULL, ";
				Sql += "[contacto] [nvarchar](250) NULL, ";
				Sql += "[FProgramada] [datetime] NULL, ";
				Sql += "[FIniReparacion] [datetime] NULL, ";
				Sql += "[FFinReparacion] [datetime] NULL, ";
				Sql += "[Tipo] [nvarchar](100) NULL, ";
				Sql += "[llamada] [varchar](150) NULL, ";
				Sql += "[enviado] [tinyint] NOT NULL, ";
				Sql += "[lastUpdate] [datetime] NULL ";
				Sql += ") ON [PRIMARY] ";
				Sql += "ALTER TABLE [dbo].[incidencias] ADD  DEFAULT (getdate()) FOR [TimeStamp] ";
				Sql += "ALTER TABLE [dbo].[incidencias] ADD  DEFAULT ((0)) FOR [enviado] ";
				Sql += "ALTER TABLE [dbo].[incidencias] ADD  DEFAULT (NULL) FOR [lastUpdate] ";
				Sql += "END; ";
				//	bot.sendMessage('911219941',Sql);			
				conexion.recHit(Emp, Sql).then(info => {
					Sql = "IF OBJECT_ID(N'PingMaquina', N'U') IS NULL BEGIN ";
					Sql += "SET ANSI_NULLS ON ";
					Sql += "SET QUOTED_IDENTIFIER ON ";
					Sql += "CREATE TABLE [dbo].[PingMaquina]( ";
					Sql += "[Id] [nvarchar](255) NULL, ";
					Sql += "[Llicencia] [float] NULL, ";
					Sql += "[TmSt] [datetime] NULL, ";
					Sql += "[Param1] [nvarchar](255) NULL, ";
					Sql += "[Param2] [nvarchar](255) NULL, ";
					Sql += "[Param3] [nvarchar](255) NULL ";
					Sql += ") ON [PRIMARY] ";
					Sql += "END; ";
					conexion.recHit(Emp, Sql).then(info => {
						Sql = "IF OBJECT_ID(N'MissatgesPerLlicencia', N'U') IS NULL BEGIN ";
						Sql += "SET ANSI_NULLS ON ";
						Sql += "SET QUOTED_IDENTIFIER ON ";
						Sql += "CREATE TABLE [dbo].[MissatgesPerLlicencia]( ";
						Sql += "[Id] [nvarchar](100) NULL, "
						Sql += "[TimeStamp] [datetime] NULL, "
						Sql += "[QuiStamp] [nvarchar](255) NULL, "
						Sql += "[DataEnviat] [datetime] NULL, "
						Sql += "[DataRebut] [datetime] NULL, "
						Sql += "[Desti] [nvarchar](255) NULL, "
						Sql += "[Origen] [nvarchar](255) NULL, "
						Sql += "[Accio] [nvarchar](255) NULL, "
						Sql += "[Param1] [nvarchar](255) NULL, "
						Sql += "[Param2] [nvarchar](255) NULL, "
						Sql += "[Param3] [nvarchar](255) NULL, "
						Sql += "[Param4] [nvarchar](255) NULL, "
						Sql += "[Texte] [nvarchar](255) NULL "
						Sql += ") ON [PRIMARY] ";
						Sql += "END; ";
						conexion.recHit(Emp, Sql).then(info => {
							console.log('Taules Ok a : ' + Emp);
						});
					});
				});
			});
		});
	});
}

function buscaId(msg) {
	BuscaMsgIdEmpresa(msg, "");
}

function BuscaMsgIdEmpresa(msg, NomEmpresaNo) {
	conexion.recHit("Hit", "select nom,db from web_empreses where nom > '" + NomEmpresaNo + "' order by nom ").then(info => {
		if (info.rowsAffected > 0) {
			registraUser(msg, info.recordset[0].db, info.recordset[0].nom);
		} else {
			botsendMessage(msg, "No trobo el Teu numero (" + msg.contact.phone_number + ") a la base de dades. \nParla amb l Oficina.");
		}
	});
}

function onlyDigits(s) {
	if (s == undefined) return false;
	for (var i = s.length - 1; i >= 0; i--) {
		const d = s.charCodeAt(i);
		if (d < 48 || d > 57) return false
	}
	return true
}

function pctCara(n1, n2) {
	var cara = ""
	var p = ((1 - n1 / n2) * 100)
	if (p < 0) cara = emoji.get('worried'); else cara = emoji.get('smiley');
	if (p < -10) cara = emoji.get('disappointed_relieved');
	if (p < -20) cara = emoji.get('rage');
	if (p > 10) cara = emoji.get('stuck_out_tongue_winking_eye');
	if (p > 20) cara = emoji.get('heart_eyes');
	return cara;
}

async function inventari(msg, estat, TipTep) {
	var keyboard = [];
	var t = '';
	var today = new Date();
	var Tenda = 761  //T73
	var Ambient = ''

	if (msg.data != 'Inventari') Ambient = msg.data.split('#')[1]
	console.log(msg.data)
	console.log(Ambient)
	//	switch (P.split(' ')[1]){
	//		case 'Inicial':
	var Sql = '';
	Sql = "select a.nom nom ,t.a ambient ,t.s servit ,t.v venut ,p.valor  d from ( "
	Sql += "select codi,max(A) A ,Sum(S) s , Sum(V) v from ( "
	Sql += "select CodiArticle codi,'' A ,sum(QuantitatServida) S ,0 V from " + nomTaulaServit(today) + " where comentari like '%Reposicion%' and hora >0 and Client=" + Tenda + " group by CodiArticle union "
	Sql += "select plu codi ,'' A,0 S,sum(quantitat)  V  from " + nomTaulaVenut(today) + " where botiga = " + Tenda + " and day(data)=" + today.getDate() + " group by plu union "
	Sql += "select distinct article codi ,max(Ambient) A ,0 S,0 V from teclatstpv where data in(select max(data) from TeclatsTpv where llicencia = " + Tenda + ") group by article "
	Sql += ") k  group by Codi  "
	Sql += ") t join articles a on a.codi = t.codi "
	Sql += "join ArticlesPropietats p on p.CodiArticle=a.codi and p.Variable ='UnitatsCoccio'  "
	Sql += "where not t.a='' and p.valor<>'' "
	Sql += "order by t.a,a.nom "

	conexion.recHit(estat[0].Valor, Sql).then(info => {
		var ii = 0, LastCli = 0, Pendents = 0, SinPapel = 0, PremutAra = 0, PremutCops = 0, Premutcap = 0, Te = '', data = '', dataT1 = '', dataT2 = '', TeE = ''
		var LastBot = 0, PendentsBot = 0, SinPapelBot = 0, PremutAraBot = 0, PremutCopsBot = 0, PremutcapBot = 0, PrmutSuficientBot = 0, Impresores = 0, be = 0, mal = 0, els = 0
		var nomEmoji = 'smiley';
		var BotigaBe = 0, BotigaMal = 0, BotigaLast = 0
		info.recordset.forEach(element => {
			nomEmoji = 'smiley'
			if (element.d >= (element.servit - element.venut)) nomEmoji = 'heart_eyes'
			if (element.d < (element.servit - element.venut)) nomEmoji = 'disappointed_relieved'
			if (element.servit == element.venut) nomEmoji = 'disappointed_relieved'
			if (element.venut > element.servit) nomEmoji = 'rage'
			if (element.venut > element.servit) nomEmoji = 'rage'
			Te = emoji.get(nomEmoji)
			Te += ' ' + (element.servit - element.venut) + ' ' + element.nom + ' ' + element.servit + ' ' + element.venut + ' ' + element.d
			Te += '\n'
			if (Ambient == '') {
				if (data != element.ambient) {
					dataT1 = emoji.get(nomEmoji) + ' ' + data + ' ' + be + ' ' + mal + ' ' + els
					dataT2 = 'Inventari #' + data
					if (data != '') keyboard.push([{ 'text': dataT1, 'callback_data': dataT2 }])
					data = element.ambient
					be = 0
					mal = 0
					els = 0
				}
				if (element.d >= (element.servit - element.venut)) be++
				if ((element.servit = element.venut) || (element.venut > element.servit) || (element.venut > element.servit)) mal++
				els++
			} else {
				if (Ambient == element.ambient) TeE += Te
			}
		})
		if (Ambient == '') {
			dataT1 = emoji.get(nomEmoji) + ' ' + data + ' ' + be + ' ' + mal + ' ' + els
			dataT2 = 'Inventari #' + data
			keyboard.push([{ 'text': dataT1, 'callback_data': dataT2 }])
			botsendMessage(msg, 'Estock ara T73', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) })
		}
		else { botsendMessage(msg, TeE) }
	})
	//		break
	//	}
}

function dataStr(d) {
	return arrayDias[d.getUTCDay()] + ' ' + d.getDate()
}
function dataStrLL(d) {
	return arrayDiasLL[d.getUTCDay()] + ' ' + sugar.Date.medium(d, 'es')
}


async function detallProductes(msg, estat, TipTep) {
	var keyboard = [];
	var t = '';
	var today = new Date();
	var today7D = new Date();
	var momentoPresente = today.getHours()
	var Sql = '';
	var CodiSuper;
	switch (msg.data.split(' ')[1]) {
		case "TriaSuper":
			Sql = "select d.codi Codi,d.nom Nom,c.codi Codiclient,hora,count(distinct CodiArticle) Articles "
			Sql += "from " + nomTaulaServit(today) + " s join clients c on c.codi=s.client "
			Sql += " join  constantsclient cc on cc.variable='SupervisoraCodi'  and cc.Codi = s.client " //and cc.valor in(1997,2310)  "
			Sql += " join dependentes d on d.CODI=cc.Valor "
			Sql += "where comentari like '%Reposicion%' "
			Sql += "group by d.nom,d.codi,c.codi ,hora "
			Sql += "order by d.nom,d.codi,c.codi ,hora "
			//botsendMessage(msg,Sql)
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var ii = 0, LastCli = 0, Pendents = 0, SinPapel = 0, PremutAra = 0, PremutCops = 0, Premutcap = 0, Te = '', data = ''
				var LastBot = 0, PendentsBot = 0, SinPapelBot = 0, PremutAraBot = 0, PremutCopsBot = 0, PremutcapBot = 0, PrmutSuficientBot = 0, Impresores = 0

				var BotigaBe = 0, BotigaMal = 0, BotigaLast = 0
				info.recordset.forEach(element => {
					if (element.Codiclient != LastBot && LastBot != 0) {  // canvi de botiga
						Impresores++
						if (PremutCops > 0) PremutCopsBot++
						if (PremutCops > (momentoPresente - 6 - 1)) PrmutSuficientBot++
						PremutCops = 0
					}
					if (element.Codi != LastCli && LastCli != 0) {
						if (PremutCopsBot) {
							Te += Impresores + ','
							Te += PremutCopsBot + ',' + pctCara(Impresores, PremutCopsBot)
							Te += PrmutSuficientBot + ',' + pctCara(Impresores, PrmutSuficientBot)
						} else {
							Te += emoji.get('rage')
						}
						keyboard.push([{ 'text': Te, 'callback_data': data }])
						PremutCopsBot = 0
						PrmutSuficientBot = 0
						Impresores = 0
					}
					LastCli = element.Codi
					LastBot = element.Codiclient
					data = 'Productes Super ' + element.Codi + ' |' + element.Nom + '|'
					Te = element.Nom.split(' ')[0] + ' '
					if (element.hora > 3 && element.Articles > 0) PremutCops++
				})
				if (Te != '') {
					Impresores++
					if (PremutCops > (momentoPresente - 6 - 1)) PrmutSuficientBot++
					if (PremutCopsBot) {
						Te += Impresores + ','
						Te += PremutCopsBot + ',' + pctCara(Impresores, PremutCopsBot)
						Te += PrmutSuficientBot + ',' + pctCara(Impresores, PrmutSuficientBot)
					} else {
						Te += emoji.get('rage')
					}
					keyboard.push([{ 'text': Te, 'callback_data': data }])
					botsendMessage(msg, Te, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) })
				} else {
					botsendMessage(msg, 'Res a dir.')
				}

			})
			break
		case undefined:
			CodiSuper = estat[0].CodiUser
		case 'Super':
			if (msg.data.split(' ')[2] != undefined) CodiSuper = msg.data.split(' ')[2]

			Sql = "Select c.nom Nom,client Codi,hora,count(distinct CodiArticle) Articles  from "
			Sql += "" + nomTaulaServit(today) + " s join clients c on c.codi=s.client "
			Sql += "where comentari like '%Reposicion%' and "
			Sql += "client in (Select c.codi from constantsclient cc join clients c on cc.codi=c.codi  where variable = 'SupervisoraCodi' and cc.valor = " + CodiSuper + " ) "
			Sql += "group by client,c.nom ,hora  order by c.nom,client "

			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var ii = 0, LastCli = 0, Pendents = 0, SinPapel = 0, PremutAra = 0, PremutCops = 0, Premutcap = 0, Te = '', data = ''
				info.recordset.forEach(element => {
					if (element.Codi != LastCli && LastCli != 0) {
						if (Pendents && PremutCops == 0) Premutcap = 1
						if (Premutcap) {
							Te += emoji.get('rage')
						} else {
							Te += emoji.get('smiley')
							if (PremutCops > (momentoPresente - 6 - 2)) { Te += emoji.get('smiley') } else { Te += emoji.get('heart_eyes') }
							Te += 'PremutCops : ' + PremutCops
						}
						keyboard.push([{ 'text': Te, 'callback_data': data }])
						Pendents = 0
						SinPapel = 0
						PremutAra = 0
						PremutCops = 0
						Premutcap = 0
					}
					LastCli = element.Codi
					Te = element.Nom + ' '
					data = 'Productes Detall ' + element.Codi + ' 0 ' + element.Nom
					if (element.hora == 0 && element.Articles > 0) Pendents = 1
					if (element.hora == 1 && element.Articles > 0) SinPapel = 1
					if (element.hora == momentoPresente && element.Articles > 0) PremutAra = 1
					if (element.hora > 3 && element.hora <= momentoPresente && element.Articles > 0) PremutCops++
				})

				if (Te != '') {
					if (Pendents && PremutCops == 0) Premutcap = 1
					if (Premutcap) {
						Te += emoji.get('rage')
					} else {
						if (Pendents) { Te += emoji.get('smiley') } else { Te += emoji.get('heart_eyes') }

						if (SinPapel) Te += 'SinPapel '
						if (Pendents) Te += 'Pendents '
						if (PremutAra) Te += 'PremutAra '
						if (PremutCops > 0) Te += 'PremutCops : ' + PremutCops
						if (SinPapel) Te += 'SinPapel '
					}
					keyboard.push([{ 'text': Te, 'callback_data': data }])
					botsendMessage(msg, 'Productes .... Tria Una Botiga', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) })
				} else {
					console.log('triasuper')
					msg.data = "Productes TriaSuper"
					detallProductes(msg, estat, TipTep)
				}
			})
			break
		case 'Detall':
			var Botiga = msg.data.split(' ')[2]
			var off = 0
			off = msg.data.split(' ')[3]
			var AmbientFixat = msg.data.split('|')[1]
			if (AmbientFixat === undefined) AmbientFixat = ''
			var ArticleFixat = msg.data.split('|')[2]
			if (ArticleFixat === undefined) ArticleFixat = 0

			today.setDate(today.getDate() - off)
			var Te = 'Detall Productes Botiga ' + msg.data.split(' ')[4] + '\n'
			Te += ' Data ' + dataStr(today)
			keyboard.push([{ 'text': '<<', 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off - 1) + ' ' + msg.data.split(' ')[4] },
			{ 'text': dataStr(today), 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off + 0) + ' ' + msg.data.split(' ')[4] },
			{ 'text': '>>', 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off + 1) + ' ' + msg.data.split(' ')[4] }]);

			Sql = "select a.Ambient ,a.NOM nom, a.codi,iif(a.valor='','','Impresora') Produccion,a.preu Preu,Sum(Qs) Servit,Sum(Qv + Qve) Venut,Sum(Qve) Equi,Sum(Mf) MinutsFalta from "
			Sql += "( "
			Sql += "select plu as codi,0 as Qs,Sum(quantitat) as Qv,0 as Mf ,0 as Qve from " + nomTaulaVenut(today) + " where botiga = " + Botiga + " and day(data) = " + today.getDate() + " group by plu  "
			Sql += ") s "
			Sql += "left join ( "
			Sql += "select preu,Ambient,nom,codi,isnull(p.valor,'') valor from ( select distinct article,Ambient from teclatstpv where data in( select max(data) from TeclatsTpv where llicencia = " + Botiga + " ) and llicencia = " + Botiga + " ) t  "
			Sql += "join articles a on a.codi=t.article  "
			Sql += "left join ArticlesPropietats p on p.CodiArticle=t.article and p.Variable ='UnitatsCoccio' "
			Sql += ") a on s.Codi = a.Codi  "
			if (AmbientFixat != '') Sql += "Where Ambient = '" + AmbientFixat + "' "
			Sql += "group by a.Ambient ,a.NOM , a.codi,a.valor,a.Preu "
			Sql += "order by a.Ambient ,a.NOM , a.codi "
			//botsendMessage(msg,Sql)
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var ii = 0, e = 0, s = 0, Ambient = ''
				info.recordset.forEach(element => {
					if (AmbientFixat == element.Ambient) {
						s = element.Servit - element.Venut
						e = element.MinutsFalta
						keyboard.push([{ 'text': element.nom + ' ' + s + ' Stock ' + e + ' Faltas', 'callback_data': 'Productes Horari ' + Botiga + ' ' + (off + 0) + ' ' + msg.data.split(' ')[4] + ' |' + Ambient + '|' + + element.codi + '|' }])
					} else {
						if (Ambient != element.Ambient && Ambient != '') {
							keyboard.push([{ 'text': Ambient + ' ' + s + ' Stock ' + e + ' Faltas', 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off + 0) + ' ' + msg.data.split(' ')[4] + ' |' + Ambient + '|' }])
							e = 0
						}
						Ambient = element.Ambient
						if (element.MinutsFalta > 0) e++;
						s = s + element.Servit - element.Venut
					}
				})
				if (Ambient != '') {
					keyboard.push([{ 'text': Ambient + ' ' + e, 'callback_data': 'Productes Detall ' + ' 0 ' }])
				}
				botsendMessage(msg, Te, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break
		case 'Horari':
			Botiga = msg.data.split(' ')[2]
			off = 0
			off = msg.data.split(' ')[3]
			AmbientFixat = msg.data.split('|')[1]
			if (AmbientFixat === undefined) AmbientFixat = ''
			ArticleFixat = msg.data.split('|')[2]
			if (ArticleFixat === undefined) ArticleFixat = 0

			today.setDate(today.getDate() - off)
			Te = 'Detall Productes Botiga ' + msg.data.split(' ')[4] + '\n'
			Te += ' Data ' + dataStr(today)
			keyboard.push([{ 'text': '<<', 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off - 1) + ' ' + msg.data.split(' ')[4] },
			{ 'text': dataStr(today), 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off + 0) + ' ' + msg.data.split(' ')[4] },
			{ 'text': '>>', 'callback_data': 'Productes Detall ' + Botiga + ' ' + (off + 1) + ' ' + msg.data.split(' ')[4] }]);
			// Sql="select h,max(a.NOM) nom,max( a.codi) codi ,max(a.preu) Preu,Sum(Qs) Servit,Sum(Qv + Qve) Venut,Sum(Qve) Equi,Sum(Mf) MinutsFalta  "
			// Sql+="from ( "
			// Sql+="select preu,Ambient,nom,codi,isnull(p.valor,'') valor from ( select distinct article,Ambient from teclatstpv where data in( select max(data) from TeclatsTpv where llicencia = " + Botiga + " ) and llicencia = " + Botiga + " ) t  "
			// Sql+="join articles a on a.codi=t.article  "
			// Sql+="left join ArticlesPropietats p on p.CodiArticle=t.article and p.Variable ='UnitatsCoccio' "
			// Sql+=") a "
			// Sql+="join ( "
			// Sql+="select datepart(hour,[timestamp]) h,CodiArticle Codi,QuantitatServida Qs, 0 as Qv,0 as Mf,0 as Qve from " + nomTaulaServit(today) + " where Client = " + Botiga + "  "
			// Sql+="union "
			// Sql+="select  datepart(hour,data) h,plu as codi,0 as Qs,quantitat as Qv,0 as Mf ,0 as Qve from " + nomTaulaVenut(today) + " where botiga = " + Botiga + " and day(data) = " + today.getDate() + " "
			// Sql+="union "
			// Sql+="select datepart(hour,DataIni) h,codiarticle as codi,0 as Qs,0 as Qv,datediff(minute,DataIni,DataFin) as Mf,0 as Qve from " + nomTaulaFaltas(today) + " where botiga = " + Botiga + " and day(dataini) = " + today.getDate() + " "
			// Sql+="union "
			// Sql+="select datepart(hour,data) h,e.ProdServit as codi,0 as Qs,0 as Qv,0 as Mf,quantitat * e.unitatsEquivalencia as Qve  from " + nomTaulaVenut(today) + " v join EquivalenciaProductes e on v.plu = e.ProdVenut where botiga = " + Botiga + " and day(data) = " + today.getDate() + " "
			// Sql+="union "
			// Sql+="SELECT * FROM (VALUES  "
			// Sql+="(6," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(7," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(8," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(9," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(10," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(11," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(12," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(13," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(14," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(15," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(16," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(17," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(18," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(19," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(20," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(21," + ArticleFixat + ",0,0,0,0), "
			// Sql+="(22," + ArticleFixat + ",0,0,0,0) "
			// Sql+=") AS t(h,Codi,Qs,Qv,Mf,Qve)  "
			// Sql+=") s on s.Codi = a.Codi  "
			// if(ArticleFixat!='') Sql+="Where a.codi  = '" + ArticleFixat + "' "
			// Sql+="group by h "
			// Sql+="order by h "
			Sql = "select c.nom Nom,h,Sum(Qs) Servit,Sum(Qv + Qve) Venut,Sum(Mf) MinutsFalta from ( "
			Sql += "select Hora h,Sum(QuantitatServida) Qs, 0 as Qv,0 as Mf,0 as Qve from " + nomTaulaServit(today) + " where Client = " + Botiga + " and CodiArticle  = '" + ArticleFixat + "'   and comentari like '%Reposicion%'  Group By Hora "
			Sql += "union "
			Sql += "select  datepart(hour,data) h,0 as Qs,Sum(quantitat) as Qv,0 as Mf ,0 as Qve from " + nomTaulaVenut(today) + " where botiga = " + Botiga + " and day(data) = " + today.getDate() + " and plu = '" + ArticleFixat + "' Group By datepart(hour,data)  "
			Sql += "union "
			Sql += "select datepart(hour,DataIni) h,0 as Qs,0 as Qv,Count(*) as Mf,0 as Qve from " + nomTaulaFaltas(today) + " where botiga = " + Botiga + " and day(dataini) = " + today.getDate() + " and codiarticle = '" + ArticleFixat + "' group By datepart(hour,DataIni) "
			Sql += "union "
			Sql += "select datepart(hour,data) h,0 as Qs,0 as Qv,0 as Mf,sum(quantitat * e.unitatsEquivalencia) as Qve  from " + nomTaulaVenut(today) + " v join EquivalenciaProductes e on v.plu = e.ProdVenut where botiga = " + Botiga + " and day(data) = " + today.getDate() + " and ProdServit  = '" + ArticleFixat + "' Group By datepart(hour,data)  "
			Sql += "union "
			Sql += "SELECT * FROM (VALUES  "
			Sql += "(6,0,0,0,0), "
			Sql += "(7,0,0,0,0), "
			Sql += "(8,0,0,0,0), "
			Sql += "(9,0,0,0,0), "
			Sql += "(10,0,0,0,0), "
			Sql += "(11,0,0,0,0), "
			Sql += "(12,0,0,0,0), "
			Sql += "(13,0,0,0,0), "
			Sql += "(14,0,0,0,0), "
			Sql += "(15,0,0,0,0), "
			Sql += "(16,0,0,0,0), "
			Sql += "(17,0,0,0,0), "
			Sql += "(18,0,0,0,0), "
			Sql += "(19,0,0,0,0), "
			Sql += "(20,0,0,0,0), "
			Sql += "(21,0,0,0,0), "
			Sql += "(22,0,0,0,0) "
			Sql += ") AS t(h,Qs,Qv,Mf,Qve)  "
			Sql += ") a left join clients c on c.codi = '" + ArticleFixat + "'   "
			Sql += "group by c.nom,h "
			Sql += "order by h "

			//botsendMessage(msg,Sql)
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var ii = 0;
				var Ambient = '', NomArticle = ''
				var e = 0
				info.recordset.forEach(element => {
					NomArticle = element.Nom
					if (element.h > 1) e = e + element.Servit - element.Venut
					keyboard.push([{ 'text': element.h + ' h. ' + e + ' = ' + element.Servit + ' -' + element.Venut + ' (' + element.MinutsFalta + ') s -v (f)', 'callback_data': 'Productes Horas ' + Botiga + ' ' + (off + 0) + ' ' + msg.data.split(' ')[4] + ' |' + Ambient + '|' + + element.codi + '|' }])
				})
				Te += NomArticle + ' \n'
				botsendMessage(msg, Te, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break
	}
}


function Comandes(msg, estat, TipTep) {
	var keyboard = [];
	var t = "", off = 0;
	var today = new Date();

	if (msg.data == undefined) msg.data = 'Llistats #TriaDia#0';
	console.log(msg.data)
	switch (msg.data.split('#')[1]) {
		case 'TriaDia':
			off = parseInt(msg.data.split('#')[2]);
			today = new Date(new Date().getTime() + (86400000 * off))
			keyboard.push([{ 'text': '-', 'callback_data': 'Comandes #TriaDia#' + (off - 1) },
			{ 'text': dataStr(today), 'callback_data': 'Comandes #TriClient#' + off + '#NoBorra' },
			{ 'text': '+', 'callback_data': 'Comandes #TriaDia#' + (off + 1) }
			]);
			if (msg.message !== undefined) bot.deleteMessage(msg.from.id, msg.message.message_id)
			botsendMessage(msg, 'Data de la comanda ? ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			break;
		case 'TriClient':
			off = parseInt(msg.data.split('#')[2]);
			var Borra = msg.data.split('#')[3]
			today = new Date(new Date().getTime() + (86400000 * off))
			var Sql = "select c.nom nom ,c.codi codi ,Count(*) coms from " + nomTaulaServit(today) + " s join clients c on c.codi= s.Client where quantitatdemanada>0 group by c.nom,c.codi order by c.nom "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.nom + ' (' + element.coms + ')', 'callback_data': 'Comandes #ClientUn#' + off + '#' + element.nom + '#' + element.codi }]);
				})
				keyboard.push([{ 'text': '+++', 'callback_data': 'Comandes #ClientAdd#' + off }]);
				if (Borra == 'SiBorra') bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, 'data : ' + today + '\nTria Client ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'ClientUn':
			off = parseInt(msg.data.split('#')[2]);
			var CliNom = msg.data.split('#')[3].substring(0, 5);
			var CliCodi = msg.data.split('#')[4];
			today = new Date(new Date().getTime() + (86400000 * off));
			var fechaFormateada = cambiarFormatoFecha(new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" }).replace(/-/g, '/').replace(/,/g, '').replace(/PM/g, ''), off);
			Sql = "select a.nom nom ,a.codi codi,sum(s.QuantitatDemanada) q ";
			Sql += "from " + nomTaulaServit(today) + " s join articles a on a.Codi = s.CodiArticle ";
			Sql += "where quantitatdemanada>0 and s.Client = " + CliCodi + " ";
			Sql += "group by a.nom,a.codi  order by a.nom";
			keyboard = [];
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				keyboard.push([{ 'text': '<<<<', 'callback_data': 'Comandes #TriClient#' + off + '#SiBorra' }]);
				datosImprimirComandas = '-------------------------------------\n';
				datosImprimirComandas += `Client: ${CliNom}` + '\n';
				var { recordset } = info;
				console.log(recordset);
				var testX = 20;
				for (var i = 0; i < recordset.length; i++) {
					keyboard.push([{ 'text': '+', 'callback_data': 'Comandes #ArticleAdd#' + off + '#' + CliNom + '#' + CliCodi + '#' + recordset[i].codi + '#' + parseInt(recordset[i].q + 1) },
					{ 'text': recordset[i].q + ' ' + recordset[i].nom, 'callback_data': 'Comandes #ArticleUn#' + off + '#' + CliNom + '#' + CliCodi + '#' + recordset[i].codi },
					{ 'text': '-', 'callback_data': 'Comandes #ArticleAdd#' + off + '#' + CliNom + '#' + CliCodi + '#' + recordset[i].codi + '#' + parseInt(String(recordset[i].q - 1)) }
					]);
					if (i == testX) {
						botsendMessage(msg, '.', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
						keyboard = [];
						testX += 20;
					}
					datosImprimirComandas += recordset[i].q + ' ' + recordset[i].nom + '\n';
				}
				botsendMessage(msg, '.', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				keyboard = [];
				/*info.recordset.forEach(element => {
					keyboard.push([ {'text': '+' , 'callback_data': 'Comandes #ArticleAdd#' + off + '#' + CliNom + '#' + CliCodi  + '#' + element.codi + '#' + parseInt(element.q + 1)},
									{'text': element.q + ' ' + element.nom , 'callback_data': 'Comandes #ArticleUn#' + off + '#' + CliNom + '#' + CliCodi  + '#' + element.codi },
									{'text': '-' , 'callback_data': 'Comandes #ArticleAdd#' + off + '#' + CliNom + '#' + CliCodi  + '#' + element.codi + '#' + parseInt(element.q - 1)}
								]);
					datosImprimirComandas += element.q + ' ' + element.nom + '\n';
					})*/
				keyboard.push([
					{ 'text': '+++', 'callback_data': 'Comandes #ArticleNou#' + off + '#' + CliNom + '#' + CliCodi + '#0' },
					{ 'text': 'Imprimir', 'callback_data': 'Comandes #Imprimir#' }
				]);
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				//botsendMessage(msg,'data : ' + today + '\nClient ' + CliNom + '\n',  {reply_markup: JSON.stringify({inline_keyboard: keyboard})});
				datosImprimirComandas += 'Data de la comanda: ' + fechaFormateada + '\n';
				datosImprimirComandas += '-------------------------------------';
			})
			break;
		case 'Imprimir':
			mandarDatosChronos(msg, datosImprimirComandas, estat[0].Valor);
			//botsendMessage(msg, datosImprimirComandas);
			datosImprimirComandas = "";
			break;
		case 'ArticleNou':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			var p = msg.data.split('#')[5]
			if (p < 0) p = 0

			today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
			Sql = "if ( select count(*) from paramshw where codi = " + CliCodi + ") = 0 "
			Sql += "begin "
			Sql += "select nom,codi,1 q  "
			Sql += "from articles where not codi in(select distinct codiarticle from " + nomTaulaServit(today) + " where Client = " + CliCodi + " and quantitatdemanada>0) "
			Sql += "group by nom,codi "
			Sql += "order by nom  OFFSET " + (10 * p) + " ROWS FETCH NEXT 10 ROWS ONLY "
			Sql += "END else  "
			Sql += "select a.nom,a.codi,sum(s.q) q "
			Sql += "from "
			Sql += "(select Plu,sum(Quantitat) q from " + nomTaulaVenut(today) + " where botiga = " + CliCodi + " and day(data) = " + today.getDate() + " group by plu)  "
			Sql += "s join articles a on a.Codi = s.plu  "
			Sql += "where not plu in(select distinct codiarticle from " + nomTaulaServit(today) + " where Client = " + CliCodi + " and quantitatdemanada>0) "
			Sql += "group by a.nom,a.codi "
			Sql += "order by a.nom  OFFSET " + (10 * p) + " ROWS FETCH NEXT 10 ROWS ONLY "
			//botsendMessage(msg,Sql)
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				keyboard.push([{ 'text': '<<<<', 'callback_data': 'Comandes #TriClient#' + off + '#SiBorra' }]);
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.q + ' , ' + element.nom, 'callback_data': 'Comandes #AaV#' + off + '#' + CliNom + '#' + CliCodi + '#' + element.codi + '#' + parseInt(element.q + 1) + '#' + element.codi + '#' + element.q }])
				})
				var p1 = parseInt(p) - 1
				if (p1 < 0) p1 = 0
				var p2 = parseInt(p) + 1
				if (keyboard.length < 10) p2 = parseInt(p) - 1
				keyboard.push([{ 'text': '<<< ' + p1 + '0', 'callback_data': 'Comandes #ArticleNou#' + off + '#' + CliNom + '#' + CliCodi + '#' + p1 },
				{ 'text': p2 + '0' + ' >>>', 'callback_data': 'Comandes #ArticleNou#' + off + '#' + CliNom + '#' + CliCodi + '#' + p2 }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				console.log(keyboard)
				botsendMessage(msg, 'data : ' + today + '\nClient ' + CliNom + '\n', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'AaV':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			p = msg.data.split('#')[5]
			var ArtCodi = msg.data.split('#')[6]
			var q = msg.data.split('#')[7]

			today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
			conexion.recHit(estat[0].Valor, "Select nom from viatges order by nom ").then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.nom, 'callback_data': 'Comandes #AaE#' + off + '#' + CliNom + '#' + CliCodi + '#' + ArtCodi + '#' + q + '#' + element.nom }])
				})
				keyboard.push([{ 'text': 'CANCELA ', 'callback_data': 'Comandes #ClientUn#' + off + '#' + CliNom + '#' + CliCodi }])
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, 'data : ' + today + '\nClient ' + CliNom + '\n', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'AaE':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			p = msg.data.split('#')[5]
			ArtCodi = msg.data.split('#')[6]
			q = msg.data.split('#')[7]
			var viatge = msg.data.split('#')[8]

			today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
			conexion.recHit(estat[0].Valor, "Select nom from EquipsDeTreball order by nom ").then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.nom, 'callback_data': 'Comandes #AaU#' + off + '#' + CliNom + '#' + CliCodi + '#' + ArtCodi + '#' + q + '#' + viatge + '#' + element.nom }])
				})
				keyboard.push([{ 'text': 'CANCELA ', 'callback_data': 'Comandes #ClientUn#' + off + '#' + CliNom + '#' + CliCodi }])
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, 'data : ' + today + '\nClient ' + CliNom + '\n', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'AaU':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			p = msg.data.split('#')[5]
			ArtCodi = msg.data.split('#')[6]
			q = msg.data.split('#')[7]
			viatge = msg.data.split('#')[8]
			var equip = msg.data.split('#')[9]

			bot.sendMessage(msg.from.id, 'Entra Unitats Comanda :', opcionsUsusari(TipTep, true))
				.then(async msg1 => {
					const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
						bot.removeReplyListener(replyId2);
						today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
						Sql = "(Id,[TimeStamp],QuiStamp,Client,CodiArticle,PluUtilitzat,Viatge,Equip,QuantitatDemanada,QuantitatTornada,QuantitatServida,MotiuModificacio,Hora,TipusComanda,Comentari,ComentariPer,Atribut,CitaDemanada,CitaServida,CitaTornada) "
						Sql += "values "
						Sql += "(newid(),getdate(),''," + CliCodi + "," + ArtCodi + "," + ArtCodi + ",'" + viatge + "','" + equip + "'," + msg2.text + ",0,0,'',0,1,'','',0,'','','') "
						conexion.recHit(estat[0].Valor, Sql).then(info => {
							if (msg2.message === undefined) { bot.deleteMessage(msg2.from.id, msg2.message_id); } else { bot.deleteMessage(msg2.from.id, msg2.message.message_id); }
							msg.data = 'Comandes #ClientUn#' + off + '#' + CliNom + '#' + CliCodi
							Comandes(msg, estat, TipTep)   // ALA recursiu							
						})
					})
				})
			break;
		case 'ArticleAdd':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			ArtCodi = msg.data.split('#')[5]
			var Q = msg.data.split('#')[6]
			today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
			Sql = "  update " + nomTaulaServit(today) + " set QuantitatDemanada = 0 where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
			Sql += "  update " + nomTaulaServit(today) + " set QuantitatDemanada = " + Q + " where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				msg.data = 'Comandes #ClientUn#' + off + '#' + CliNom + '#' + CliCodi
				Comandes(msg, estat, TipTep)   // ALA recursiu							
			})
			break;
		case 'ArticleUn':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			ArtCodi = msg.data.split('#')[5]

			bot.sendMessage(msg.from.id, 'Entra Unitats Comanda :', opcionsUsusari(TipTep, true))
				.then(async msg1 => {
					const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
						bot.removeReplyListener(replyId2);
						today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
						Sql = "  update " + nomTaulaServit(today) + " set QuantitatDemanada = 0 where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
						Sql += "  update " + nomTaulaServit(today) + " set QuantitatDemanada = " + msg2.text + " where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
						conexion.recHit(estat[0].Valor, Sql).then(info => {
							if (msg2.message === undefined) { bot.deleteMessage(msg2.from.id, msg2.message_id); } else { bot.deleteMessage(msg2.from.id, msg2.message.message_id); }
							msg.data = 'Comandes #ClientUn#' + off + '#' + CliNom + '#' + CliCodi
							Comandes(msg, estat, TipTep)   // ALA recursiu							
						})
					})
				})
			break;


		case 'Detall':
			break
	}
}


function Cfg(msg, estat, TipTep) {
	var keyboard = [];
	var t = "", off = 0;
	var today = new Date();

	if (msg.data == undefined) msg.data = 'Cfg #TriaDia#0';
	console.log(msg.data)
	switch (msg.data.split('#')[1]) {
		case 'TriaDia':
			off = parseInt(msg.data.split('#')[2]);
			today = new Date(new Date().getTime() + (86400000 * off))
			keyboard.push([{ 'text': '-', 'callback_data': 'Cfg #TriaDia#' + (off - 1) },
			{ 'text': dataStr(today), 'callback_data': 'Cfg #TriClient#' + off },
			{ 'text': '+', 'callback_data': 'Cfg #TriaDia#' + (off + 1) }
			]);
			if (msg.message !== undefined) bot.deleteMessage(msg.from.id, msg.message.message_id)
			botsendMessage(msg, 'Data de la comanda ? ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			break;
		case 'TriClient':
			off = parseInt(msg.data.split('#')[2]);
			today = new Date(new Date().getTime() + (86400000 * off))
			msg.message.reply_markup.inline_keyboard.forEach(element => { if (element.text == msg.text) return true; if (element.text != undefined && element.text.substring(0, 2) == '--') keyboard.push([element]); })
			keyboard.push([{ 'text': '--Data Treball : ' + dataStr(today), 'callback_data': 'Cfg #TriaDia#' + off }])
			var Sql = "select c.nom nom ,c.codi codi ,Count(*) coms from " + nomTaulaServit(today) + " s join clients c on c.codi= s.Client where quantitatdemanada>0 group by c.nom,c.codi order by c.nom "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.nom + ' (' + element.coms + ')', 'callback_data': 'Cfg #TriaArt#' + off + '#' + element.nom + '#' + element.codi + '#0' }]);
				})
				keyboard.push([{ 'text': '+++', 'callback_data': 'Cfg #ClientAdd#' + off }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, '...', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'TriaArt':
			off = parseInt(msg.data.split('#')[2]);
			var CliNom = msg.data.split('#')[3] // .substring(0,5);
			var CliCodi = msg.data.split('#')[4];
			var p = parseInt(msg.data.split('#')[5]);
			var p1, p2;
			if (p <= 0) p = 0; p1 = p - 1; if (p1 <= 0) p1 = 0; p2 = p + 1
			today = new Date(new Date().getTime() + (86400000 * off));

			var Titol = '-- Client : '
			var prou = false
			msg.message.reply_markup.inline_keyboard.forEach(element => { if (element[0].text.substring(0, Titol.length) == Titol) { prou = true; if (CliNom == 'kkkkkk') keyboard.push([element[0]]); }; if (!prou && element[0].text.substring(0, 2) == '--') keyboard.push([element[0]]); })
			if (!prou) keyboard.push([{ 'text': Titol + CliNom, 'callback_data': 'Cfg #TriClient#' + off }])

			Sql = "select min(isnull(cc.Client,-1)) cnf ,a.nom nom ,a.codi codi,sum(s.QuantitatDemanada) q "
			Sql += "from " + nomTaulaServit(today) + " s join articles a on a.Codi = s.CodiArticle "
			Sql += "left join (Select Codiarticle,isnull(client,0) Client From  ComandesMemotecnicPerClient) cc on a.Codi = cc.CodiArticle  "
			Sql += "where quantitatdemanada>0 and s.Client = " + CliCodi + " "
			Sql += "group by a.nom,a.codi  order by a.nom "
			Sql += "OFFSET " + (10 * p) + " ROWS FETCH NEXT 10 ROWS ONLY "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					var emoti = ''; if (element.cnf == 0) emoti += '\u{1F30F}'; if (element.cnf == -1) emoti += ''
					keyboard.push([{ 'text': emoti + ' ' + element.q + ' , ' + element.nom, 'callback_data': 'Cfg #AaV#' + off + '#' + CliCodi + '#' + element.codi + '#' + element.nom + '#' + p }])
				})
				keyboard.push([{ 'text': '<<< ' + p1 + '0', 'callback_data': 'Cfg #TriaArt#' + off + '#' + CliNom + '#' + CliCodi + '#' + p1 },
				{ 'text': p2 + '0' + ' >>>', 'callback_data': 'Cfg #TriaArt#' + off + '#' + CliNom + '#' + CliCodi + '#' + p2 }]);
				keyboard.push([{ 'text': '+++', 'callback_data': 'Comandes #ArticleNou#' + off + '#' + CliNom + '#' + CliCodi + '#0' }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, '...', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'ArticleNou':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			p = msg.data.split('#')[5]
			if (p < 0) p = 0

			today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
			Sql = "if ( select count(*) from paramshw where codi = " + CliCodi + ") = 0 "
			Sql += "begin "
			Sql += "select nom,codi,1 q  "
			Sql += "from articles where not codi in(select distinct codiarticle from " + nomTaulaServit(today) + " where Client = " + CliCodi + " and quantitatdemanada>0) "
			Sql += "group by nom,codi "
			Sql += "order by nom  OFFSET " + (10 * p) + " ROWS FETCH NEXT 10 ROWS ONLY "
			Sql += "END else  "
			Sql += "select a.nom,a.codi,sum(s.q) q "
			Sql += "from "
			Sql += "(select Plu,sum(Quantitat) q from " + nomTaulaVenut(today) + " where botiga = " + CliCodi + " and day(data) = " + today.getDate() + " group by plu)  "
			Sql += "s join articles a on a.Codi = s.plu  "
			Sql += "where not plu in(select distinct codiarticle from " + nomTaulaServit(today) + " where Client = " + CliCodi + " and quantitatdemanada>0) "
			Sql += "group by a.nom,a.codi "
			Sql += "order by a.nom  OFFSET " + (10 * p) + " ROWS FETCH NEXT 10 ROWS ONLY "
			//botsendMessage(msg,Sql)
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				keyboard.push([{ 'text': '<<<<', 'callback_data': 'Cfg #TriClient#' + off + '#SiBorra' }]);
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.q + ' , ' + element.nom, 'callback_data': 'Cfg #AaV#' + off + '#' + CliNom + '#' + CliCodi + '#' + element.codi + '#' + parseInt(element.q + 1) + '#' + element.codi }])
				})
				var p1 = parseInt(String(p)) - 1
				if (p1 < 0) p1 = 0
				var p2 = parseInt(String(p)) + 1
				if (keyboard.length < 10) p2 = parseInt(String(p)) - 1
				keyboard.push([{ 'text': '<<< ' + p1 + '0', 'callback_data': 'Cfg #ArticleNou#' + off + '#' + CliNom + '#' + CliCodi + '#' + p1 },
				{ 'text': p2 + '0' + ' >>>', 'callback_data': 'Cfg #ArticleNou#' + off + '#' + CliNom + '#' + CliCodi + '#' + p2 }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				console.log(keyboard)
				botsendMessage(msg, '...', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'AaV':
			off = parseInt(msg.data.split('#')[2]);
			CliCodi = msg.data.split('#')[3]
			var ArtCodi = msg.data.split('#')[4]
			var ArtNom = msg.data.split('#')[5]

			Titol = '-- Article : '
			prou = false
			msg.message.reply_markup.inline_keyboard.forEach(element => { if (element[0].text.substring(0, Titol.length) == Titol) prou = true; if (!prou && element[0].text.substring(0, 2) == '--') keyboard.push([element[0]]); })
			if (!prou) keyboard.push([{ 'text': Titol + ArtNom, 'callback_data': 'Cfg #TriaArt#' + off + '#' + 'kkkkkk' + '#' + CliCodi + '#' + p }])

			Sql = 'Select nom,isnull(cc1.client,0) tots,isnull(cc2.client,0) yo,valor from viatges v '
			Sql += 'left join (Select distinct Viatge,isnull(client,-1) client from ComandesMemotecnicPerClient Where CodiArticle=' + ArtCodi + ' and Client is null) cc1 on cc1.Viatge = v.nom '
			Sql += 'left join (Select distinct Viatge,isnull(client,-1) client from ComandesMemotecnicPerClient Where CodiArticle=' + ArtCodi + '  and Client = ' + CliCodi + '   ) cc2 on cc2.Viatge = v.nom '
			Sql += "left join (Select Valor,Nomviatge from ViatgesPropietats Where Variable = 'REPOSICION' ) cc3 on cc3.nomviatge = v.nom "
			Sql += 'order by nom '
			//botsendMessage(msg,Sql)
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					var emoti = ''
					var emoti2 = ''
					if (element.tots == -1) emoti += '\u{1F30F} '
					if (element.yo == CliCodi) emoti += '\u{2705} '

					if (element.valor == 'SEMANAL') emoti2 += '\u{1F4CC} '

					if (emoti == '') emoti = '\u{274C} '
					keyboard.push([{ 'text': emoti + ' ' + element.nom + ' ' + emoti2, 'callback_data': 'Cfg #AaE#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + element.nom }])
				})
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, '...', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'AaE':
			msg.message.reply_markup.inline_keyboard.forEach(element => { if (element.text == '<<<<<<<<') var atras = element.callback_data })
			off = parseInt(msg.data.split('#')[2]);
			CliCodi = msg.data.split('#')[3]
			ArtCodi = msg.data.split('#')[4]
			var viatge = msg.data.split('#')[5]
			Titol = '-- Viatge  : '
			prou = false
			msg.message.reply_markup.inline_keyboard.forEach(element => { if (element[0].text.substring(0, Titol.length) == Titol) prou = true; if (!prou && element[0].text.substring(0, 2) == '--') keyboard.push([element[0]]); })
			if (!prou) keyboard.push([{ 'text': Titol + viatge, 'callback_data': 'Cfg #AaV#' + off + '#' + CliCodi + '#' + ArtCodi + '#0' }])

			Sql = "Select nom,isnull(cc1.client,0) tots,isnull(cc2.client,0) yo from EquipsDeTreball e "
			Sql += "left join (Select distinct Equip,isnull(client,-1) client from ComandesMemotecnicPerClient Where viatge='" + viatge + "' And CodiArticle=" + ArtCodi + " and Client is null) cc1 on cc1.Equip = e.nom "
			Sql += "left join (Select distinct Equip,isnull(client,-1) client from ComandesMemotecnicPerClient Where viatge='" + viatge + "' And CodiArticle=" + ArtCodi + " and Client = " + CliCodi + ") cc2 on cc2.Equip = e.nom "
			Sql += "order by nom "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					var emoti = ''
					if (element.tots == -1) emoti += '\u{1F30F}'
					if (element.yo == CliCodi) emoti += '\u{2705}'
					if (emoti == '') emoti = '\u{274C}'
					keyboard.push([{ 'text': emoti + ' ' + element.nom, 'callback_data': 'Cfg #AaU#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + viatge + '#' + element.nom }])
				})
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, '...', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'AaU':
			off = parseInt(msg.data.split('#')[2]);
			CliCodi = msg.data.split('#')[3]
			ArtCodi = msg.data.split('#')[4]
			viatge = msg.data.split('#')[5]
			var Equip = msg.data.split('#')[6]
			var acc = msg.data.split('#')[7]

			Titol = '-- Equip  : '
			prou = false
			msg.message.reply_markup.inline_keyboard.forEach(element => { if (element[0].text.substring(0, Titol.length) == Titol) prou = true; if (!prou && element[0].text.substring(0, 2) == '--') keyboard.push([element[0]]); })
			if (!prou) keyboard.push([{ 'text': Titol + Equip, 'callback_data': 'Cfg #AaE#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + viatge }])

			Sql = 'Select Top 1 * From Articles'
			if (acc == 1) Sql = "Delete ComandesMemotecnicPerClient Where CodiArticle = " + ArtCodi + "                                                             insert into ComandesMemotecnicPerClient (CodiArticle,Viatge,Equip,Client,Prob,Pct,[TimeStamp]) Values (" + ArtCodi + ",'" + viatge + "','" + Equip + "',Null,1,1,getdate()) "
			if (acc == 2) Sql = "Delete ComandesMemotecnicPerClient Where CodiArticle = " + ArtCodi + " and Viatge = '" + viatge + "'                               insert into ComandesMemotecnicPerClient (CodiArticle,Viatge,Equip,Client,Prob,Pct,[TimeStamp]) Values (" + ArtCodi + ",'" + viatge + "','" + Equip + "',Null,1,1,getdate()) "
			if (acc == 3) Sql = "Delete ComandesMemotecnicPerClient Where CodiArticle = " + ArtCodi + " and Client = " + CliCodi + "                               insert into ComandesMemotecnicPerClient (CodiArticle,Viatge,Equip,Client,Prob,Pct,[TimeStamp]) Values (" + ArtCodi + ",'" + viatge + "','" + Equip + "'," + CliCodi + ",1,1,getdate()) "
			if (acc == 4) Sql = "Delete ComandesMemotecnicPerClient Where CodiArticle = " + ArtCodi + " and Client = " + CliCodi + " and Viatge = '" + viatge + "' insert into ComandesMemotecnicPerClient (CodiArticle,Viatge,Equip,Client,Prob,Pct,[TimeStamp]) Values (" + ArtCodi + ",'" + viatge + "','" + Equip + "'," + CliCodi + ",1,1,getdate()) "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var Vc = 0;
				var Ec = 0;
				var VEc = 0;
				var VE = 0
				conexion.recHit(estat[0].Valor, "select Viatge,Equip,isnull(Client,-1) Client from ComandesMemotecnicPerClient where codiarticle=" + ArtCodi).then(info => {
					info.recordset.forEach(element => {
						if (element.Viatge == viatge && element.Client == CliCodi) Vc++
						if (element.Equip == Equip && element.Client == CliCodi) Ec++
						if (element.Viatge == viatge && element.Equip == Equip && element.Client == CliCodi) VEc++
						if (element.Viatge == viatge && element.Equip == Equip && element.Client == -1) VE++
					})
					var emoti = ''; if (VE == 1) emoti += '\u{2705}'
					keyboard.push([{ 'text': emoti + ' Per Tots Els Clients Sols En Aquest Viatge', 'callback_data': 'Cfg #AaU#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + viatge + '#' + Equip + '#' + 1 }])
					emoti = ''; if (VE > 1) emoti += '\u{2705}'
					keyboard.push([{ 'text': emoti + ' Per Tots Els Clients Tambe en d Altres Viatges', 'callback_data': 'Cfg #AaU#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + viatge + '#' + Equip + '#' + 2 }])
					emoti = ''; if (Vc == 1) emoti += '\u{2705}'
					keyboard.push([{ 'text': emoti + ' Sols Per Aquest Client Sols En Aquest Viatge', 'callback_data': 'Cfg #AaU#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + viatge + '#' + Equip + '#' + 3 }])
					emoti = ''; if (Vc > 1) emoti += '\u{2705}'
					keyboard.push([{ 'text': emoti + ' Sols Per Aquest Client , Tambe en d Altres Viatges', 'callback_data': 'Cfg #AaU#' + off + '#' + CliCodi + '#' + ArtCodi + '#' + viatge + '#' + Equip + '#' + 4 }])
					bot.deleteMessage(msg.from.id, msg.message.message_id)
					botsendMessage(msg, '...', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				})
			})
			break;
		case 'ArticleAdd':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			ArtCodi = msg.data.split('#')[5]
			var Q = msg.data.split('#')[6]
			today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
			Sql = "  update " + nomTaulaServit(today) + " set QuantitatDemanada = 0 where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
			Sql += "  update " + nomTaulaServit(today) + " set QuantitatDemanada = " + Q + " where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				msg.data = 'Cfg #ClientUn#' + off + '#' + '--' + '#' + CliCodi + '#0'
				Cfg(msg, estat, TipTep)   // ALA recursiu							
			})
			break;
		case 'ArticleUn':
			off = parseInt(msg.data.split('#')[2]);
			CliNom = msg.data.split('#')[3]
			CliCodi = msg.data.split('#')[4]
			ArtCodi = msg.data.split('#')[5]

			bot.sendMessage(msg.from.id, 'Entra Unitats Comanda :', opcionsUsusari(TipTep, true))
				.then(async msg1 => {
					const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
						bot.removeReplyListener(replyId2);
						today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
						Sql = "  update " + nomTaulaServit(today) + " set QuantitatDemanada = 0 where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
						Sql += "  update " + nomTaulaServit(today) + " set QuantitatDemanada = " + msg2.text + " where Client = " + CliCodi + " And CodiArticle = " + ArtCodi + " "
						conexion.recHit(estat[0].Valor, Sql).then(info => {
							if (msg2.message === undefined) { bot.deleteMessage(msg2.from.id, msg2.message_id); } else { bot.deleteMessage(msg2.from.id, msg2.message.message_id); }
							msg.data = 'Cfg #ClientUn#' + off + '#' + '--' + '#' + CliCodi + '#0'
							Cfg(msg, estat, TipTep)   // ALA recursiu							
						})
					})
				})
			break;


		case 'Detall':
			break
	}
}


function Llistats(msg, estat, TipTep) {
	var keyboard = [];
	var t = "", off = 0;
	var today = new Date();

	if (msg.data == undefined) msg.data = 'Llistats #TriaDia#0';
	console.log(msg.data)
	switch (msg.data.split('#')[1]) {
		case 'TriaDia':
			off = parseInt(msg.data.split('#')[2]);
			today = new Date(new Date().getTime() + (86400000 * off))
			keyboard.push([{ 'text': '-', 'callback_data': 'Llistats #TriaDia#' + (off - 1) },
			{ 'text': dataStr(today), 'callback_data': 'Llistats #TriaEquip#' + off },
			{ 'text': '+', 'callback_data': 'Llistats #TriaDia#' + (off + 1) }
			]);
			if (msg.message !== undefined) bot.deleteMessage(msg.from.id, msg.message.message_id)
			botsendMessage(msg, 'Data del llistat ? ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			break;
		case 'TriaEquip':
			off = parseInt(msg.data.split('#')[2]);
			today = new Date(new Date().getTime() + (86400000 * off))
			var Sql = "select distinct equip from " + nomTaulaServit(today) + " where quantitatdemanada>0 order by equip "
			//botsendMessage(msg,Sql);
			var equip;
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.equip, 'callback_data': 'Llistats #TriaMasa#' + off + '#' + element.equip + '#0' }]);
					equip = element.equip
				})
				if (keyboard.length == 0) {
					botsendMessage(msg, 'Cap comanda x avui ');
				}
				if (keyboard.length == 1) {
					msg.data = 'Llistats #TriaMasa#' + off + '#' + equip + '#1'
					Llistats(msg, estat, TipTep)   // ALA recursiu
				}
				if (keyboard.length > 1) {
					//					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					botsendMessage(msg, 'Tria Equip', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
					//						});
				}
			})
			break;
		case 'TriaMasa':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			var Borra = msg.data.split('#')[4]
			today = new Date(new Date().getTime() + (86400000 * off))

			Sql = "select max(left(masa,40)) masa, str(sum(tot),8,3) tot  "
			Sql += "from (  "
			Sql += "select isnull(m.codi, 0) codi, isnull(m.grup,'**Altres**') masa, a.nom art, isnull(m.factor,1)/isnull(m.piezas,1) fact, sum(QuantitatDemanada)-sum(s.quantitatTornada) qd, "
			Sql += "CONVERT(decimal(18,3), max(isnull(m.factor,1)/isnull(m.piezas,1)) * (sum(s.QuantitatDemanada)-sum(s.quantitatTornada) )) tot "
			Sql += "from " + nomTaulaServit(today) + " s  "
			Sql += "left join masas m on m.article=s.codiArticle and m.viatge=s.viatge  "
			Sql += "left join articles a on a.codi=s.codiArticle  "
			Sql += "where equip='" + equip + "' and QuantitatDemanada>0  "
			Sql += "group by m.grup, m.codi, a.nom, m.factor, m.piezas "
			Sql += ")k  "
			Sql += "group by masa "
			Sql += "order by masa "
			//botsendMessage(msg,Sql);
			//Sql = `INSERT INTO FeinesAFer`;
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.masa, 'callback_data': 'Llistats #Pinta#' + off + '#' + equip + '#' + element.masa + '#0' }]);
					var masa = element.masa
				})

				if (keyboard.length == 0) {
					botsendMessage(msg, 'Cap comanda x avui ');
				}
				if (keyboard.length == 1) {
					msg.data = 'Llistats #Pinta#' + off + '#' + equip + '#' + masa + '#1'
					Llistats(msg, estat, TipTep)   // ALA recursiu
				}
				if (keyboard.length > 1) {
					//					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					keyboard.push([{ 'text': 'Imprimir Tot :' + equip, 'callback_data': 'Llistats #Imprimir#' + off + '#' + equip + + '#Tots' }])
					botsendMessage(msg, 'Tria Masa', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
					//						});
				}
			})
			break;
		case 'Pinta':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			var masa = msg.data.split('#')[4]
			Borra = msg.data.split('#')[5]
			today = new Date(new Date().getTime() + (86400000 * off))

			Sql="select max(left(masa,40)) masa, codi, art, str(max(fact),8,3) fact, sum(qd) qd, str(sum(tot),8,3) tot  "
			Sql+="from (  "
			Sql+="select isnull(m.codi, 0) codi, isnull(m.grup,'**Altres**') masa, a.nom art, isnull(m.factor,1)/isnull(m.piezas,1) fact, sum(QuantitatDemanada)-sum(s.quantitatTornada) qd, "
			Sql+="CONVERT(decimal(18,3), max(isnull(m.factor,1)/isnull(m.piezas,1)) * (sum(s.QuantitatDemanada)-sum(s.quantitatTornada) )) tot "
			Sql+="from " + nomTaulaServit(today) + " s  "
			Sql+="left join masas m on m.article=s.codiArticle and m.viatge=s.viatge  "
			Sql+="left join articles a on a.codi=s.codiArticle  "
			Sql+="where equip='" + equip + "' and QuantitatDemanada>0  "
			Sql+="group by m.grup, m.codi, a.nom, m.factor, m.piezas "
			Sql+=")k  where masa = '" + masa + "' "
			Sql+="group by masa,codi,art  "
			Sql+="order by masa,art "
//botsendMessage(msg,Sql);
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				t='Llistat Produccio ' + equip + ' Data ' + dataStrLL(today) + '\n'
				masa=''
				var su=0
				info.recordset.forEach(element => {
//console.log(element.art.substring(0, 15) )
					if (masa!=element.masa && su>0){t+="<b>------------------------------------\n                      Total : " + su.toFixed(3) + '</b>\n'; su=0}
					if (masa!=element.masa) t+=" <b>" + element.masa + '</b> \n'
					masa=element.masa
					var sqd='   ' + element.qd 
					var sArt = element.art + '                     '
					t+= '<code> '+ sqd.substr(sqd.length - 3)  + ' ' + sArt.substring(0, 15)  + element.fact  + element.tot +  '</code> ' + ' \n'
					su+=Number( element.tot)
				});
				if (su>0)t+="<b>------------------------------------\n                      Total : " + su.toFixed(3) + '</b>\n'
				t+= "  " + ' \n';
				datosImprimirListado = t.split("<code>").join("").split("</code>").join("").split("<b>").join("").split("</b>").join("");
				console.log(datosImprimirListado);
				//if(msg.message!=undefined)bot.deleteMessage(msg.from.id, msg.message.message_id)
				keyboard.push([	{'text': 'Imprimir' , 'callback_data': 'Llistats #Imprimir#' + off + '#' + equip},
								{'text': 'Modificar', 'callback_data': 'Llistats #Modifica#' + off + '#' + equip}
							]);
				keyboard.push([{'text': '<< data <<' , 'callback_data': 'Llistats #TriaDia#' + off }]);
				//			\\{'parse_mode': 'HTML'}
				if (Borra=='0') bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg,t, {'parse_mode': 'HTML',reply_markup: JSON.stringify({inline_keyboard: keyboard})});
			})
			console.log(equip, masa, today);
			insertarFeinesAFer(msg, estat[0].Valor, equip, masa, today);
			//botsendMessage(msg, Sql);			
			break;
		case 'Imprimir':
			mandarDatosChronos(msg, datosImprimirListado, estat[0].Valor);
			datosImprimirListado = "";
			break;
		case 'Modifica':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			today = new Date(new Date().getTime() + (86400000 * off))

			Sql = "select distinct max(masa) masa "
			Sql += "from (  "
			Sql += "select isnull(m.codi, 0) codi, isnull(m.grup,'**Altres**') masa, a.nom art, isnull(m.factor,1)/isnull(m.piezas,1) fact, sum(QuantitatDemanada)-sum(s.quantitatTornada) qd, "
			Sql += "CONVERT(decimal(18,3), max(isnull(m.factor,1)/isnull(m.piezas,1)) * (sum(s.QuantitatDemanada)-sum(s.quantitatTornada) )) tot "
			Sql += "from " + nomTaulaServit(today) + " s  "
			Sql += "left join masas m on m.article=s.codiArticle and m.viatge=s.viatge  "
			Sql += "left join articles a on a.codi=s.codiArticle  "
			Sql += "where equip='" + equip + "' and QuantitatDemanada>0  "
			Sql += "group by m.grup, m.codi, a.nom, m.factor, m.piezas "
			Sql += ")k  "
			Sql += "group by masa "
			Sql += "order by masa "
			//botsendMessage(msg,Sql);
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.masa, 'callback_data': 'Llistats #ModificaMasa#' + off + '#' + equip + '#' + element.masa }]);
				})
				keyboard.push([{ 'text': '<< Llistat <<', 'callback_data': 'Llistats #Pinta#' + off + '#' + equip + '#0' }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					botsendMessage(msg, 'Edita Masa ' + equip + ' Data ' + dataStrLL(today), { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				});
			})
			break;
		case 'ModificaMasa':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			masa = msg.data.split('#')[4]
			today = new Date(new Date().getTime() + (86400000 * off))

			Sql = "select top 15 codi, art, str(max(fact),8,3) fact "
			Sql += "from (  "
			Sql += "select isnull(a.codi, 0) codi, isnull(m.grup,'**Altres**') masa, a.nom art, isnull(m.factor,1)/isnull(m.piezas,1) fact, sum(QuantitatDemanada)-sum(s.quantitatTornada) qd, "
			Sql += "CONVERT(decimal(18,3), max(isnull(m.factor,1)/isnull(m.piezas,1)) * (sum(s.QuantitatDemanada)-sum(s.quantitatTornada) )) tot "
			Sql += "from " + nomTaulaServit(today) + " s  "
			Sql += "left join masas m on m.article=s.codiArticle and m.viatge=s.viatge  "
			Sql += "left join articles a on a.codi=s.codiArticle  "
			Sql += "where equip='" + equip + "' and QuantitatDemanada>0  "
			Sql += "group by m.grup, a.codi, a.nom, m.factor, m.piezas ) k where "
			Sql += " masa = '" + masa + "' "
			Sql += "group by art,codi,fact "
			Sql += "order by art "
			//botsendMessage(msg,Sql);
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.art, 'callback_data': 'Llistats #ModificaMasaArti#' + off + '#' + equip + '#' + masa + '#' + element.codi },
					{ 'text': element.fact, 'callback_data': 'Llistats #ModificaMasaFact#' + off + '#' + equip + '#' + masa + '#' + element.codi },
					{ 'text': masa, 'callback_data': 'Llistats #ModificaMasaMasa#' + off + '#' + equip + '#' + masa + '#' + element.codi }
					]);
				})
				keyboard.push([{ 'text': '<< Back <<', 'callback_data': 'Llistats #Modifica#' + off + '#' + equip }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					botsendMessage(msg, 'Edita Masa ' + masa, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				});
			})
			break;
		case 'ModificaMasaMasa':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			masa = msg.data.split('#')[4]
			var codi = msg.data.split('#')[5]

			Sql = "select distinct grup from Masas  order by grup"
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.grup, 'callback_data': 'Llistats #Mmt#' + off + '#' + equip + '#' + masa + '#' + codi + '#' + element.grup }])
				})
				keyboard.push([{ 'text': 'Crea Nou', 'callback_data': 'Llistats #Mmt#' + off + '#' + equip + '#' + masa + '#' + codi + '#' + '++++' }])
				//console.log(keyboard);
				bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					botsendMessage(msg, 'Tria grup :', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				});
			})
			break;
		case 'Mmt':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			masa = msg.data.split('#')[4]
			codi = msg.data.split('#')[5]
			var grup = msg.data.split('#')[6]

			if (grup == '++++') {
				bot.sendMessage(msg.from.id, 'Entra El grup :', opcionsUsusari(TipTep, true))
					.then(async msg1 => {
						const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
							bot.removeReplyListener(replyId2);
							today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
							grup = msg2.text
							codi = msg.data.split('#')[5]
							Sql = "insert into masas "
							Sql += "select '" + grup + "'  as Grup," + codi + " as Article,1 as factor, s.viatge , 1 as atribut,  "
							Sql += "(select isnull(max(kg),50) Kg from masas where grup= '" + grup + "' ) as kg , "
							Sql += "(select isnull(max(kg),1) Codi from masas where grup= '" + grup + "' ) as Codi , "
							Sql += "1 as piezas "
							Sql += "from " + nomTaulaServit(today) + " s left join masas m on m.Viatge = s.viatge and m.Article = s.CodiArticle where m.grup is null and CodiArticle = " + codi + " group by s.Viatge "
							Sql += "update m set grup = '" + grup + "' from masas m join " + nomTaulaServit(today) + " s on s.CodiArticle = m.Article and s.Viatge = m.Viatge where  article = " + codi + " "
							conexion.recHit(estat[0].Valor, Sql).then(info => {
								msg.data = 'Llistats #ModificaMasa#' + msg.data.split('#')[2] + '#' + msg.data.split('#')[3] + '#' + msg.data.split('#')[4]
								Llistats(msg, estat, TipTep)   // ALA recursiu							
							})
						})
					})
			}
			else {
				today = new Date(new Date().getTime() + (86400000 * off))
				Sql = "insert into masas "
				Sql += "select '" + grup + "'  as Grup," + codi + " as Article,1 as factor, s.viatge , 1 as atribut,  "
				Sql += "(select isnull(max(kg),50) Kg from masas where grup= '" + grup + "' ) as kg , "
				Sql += "(select isnull(max(kg),1) Codi from masas where grup= '" + grup + "' ) as Codi , "
				Sql += "1 as piezas "
				Sql += "from " + nomTaulaServit(today) + " s left join masas m on m.Viatge = s.viatge and m.Article = s.CodiArticle where m.grup is null and CodiArticle = " + codi + " group by s.Viatge "
				Sql += "update m set grup = '" + grup + "' from masas m join " + nomTaulaServit(today) + " s on s.CodiArticle = m.Article and s.Viatge = m.Viatge where  article = " + codi + " "
				//botsendMessage(msg,Sql)
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					msg.data = 'Llistats #ModificaMasa#' + msg.data.split('#')[2] + '#' + msg.data.split('#')[3] + '#' + msg.data.split('#')[4]
					Llistats(msg, estat, TipTep)   // ALA recursiu							
				})
			}
			break;
		case 'ModificaMasaFact':
			off = parseInt(msg.data.split('#')[2])
			equip = msg.data.split('#')[3]
			masa = msg.data.split('#')[4]
			codi = msg.data.split('#')[5]

			bot.sendMessage(msg.from.id, 'Entra El factor :', opcionsUsusari(TipTep, true))
				.then(async msg1 => {
					const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
						bot.removeReplyListener(replyId2);
						today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
						Sql = "update m set factor = " + msg2.text + " from masas m join " + nomTaulaServit(today) + " s on s.CodiArticle = m.Article and s.Viatge = m.Viatge where  article = " + msg.data.split('#')[5];
						//botsendMessage(msg,Sql)						
						conexion.recHit(estat[0].Valor, Sql).then(info => {
							msg.data = 'Llistats #ModificaMasa#' + msg.data.split('#')[2] + '#' + msg.data.split('#')[3] + '#' + msg.data.split('#')[4]
							Llistats(msg, estat, TipTep)   // ALA recursiu							
						})
					})
				})
			break;
		case 'Detall':
			break
	}
}

async function Preus(msg, estat, TipTep) {
	var keyboard = [];
	var t = "", off = 0;

	if (msg.data == undefined) msg.data = 'Preus #TriaBotiga';
	console.log(msg.data)
	switch (msg.data.split('#')[1]) {
		case 'TriaBotiga':
			var Sql = "select c.codi,c.nom  from paramshw w join clients c on c.codi = w.codi order by c.nom "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					keyboard.push([{ 'text': element.nom, 'callback_data': 'Preus #Teclat#' + element.codi + '#' + element.nom + '' }]);
				})
				if (keyboard.length == 1) {
					msg.data = keyboard[0][0].callback_data
					Preus(msg, estat, TipTep)   // ALA recursiu
				}
				if (keyboard.length > 1) {
					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
						botsendMessage(msg, 'Tria Botiga', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
					});
				}
			})
			break;
		case 'Teclat':
			var BotigaCodi = msg.data.split('#')[2]
			var BotigaNom = msg.data.split('#')[3]

			Sql = "select distinct ambient from teclatstpv where data in( "
			Sql += "select max(data) from TeclatsTpv where llicencia = " + BotigaCodi + " "
			Sql += ") and llicencia = " + BotigaCodi + " ";
			Sql += "order by ambient "

			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var linea = [];
				info.recordset.forEach(element => {
					linea.push({ 'text': element.ambient, 'callback_data': 'Preus #Grup#' + BotigaCodi + '#' + BotigaNom + '#' + element.ambient });
					if (linea.length == 3) { keyboard.push(linea); linea = []; }
				})
				if (linea != []) { keyboard.push(linea); linea = []; }
				//					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
				botsendMessage(msg, 'Grups de Teclat De ' + BotigaNom, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				//					});
			});
			break;
		case 'Grup':
			BotigaCodi = msg.data.split('#')[2]
			BotigaNom = msg.data.split('#')[3]
			var Grup = msg.data.split('#')[4]

			Sql = "select a.Codi,a.nom,a.PREU,a.EsSumable "
			Sql += "from teclatstpv t join articles a on t.Article=a.Codi where data in( select max(data) "
			Sql += "from TeclatsTpv where llicencia = " + BotigaCodi + " ) and llicencia = " + BotigaCodi + " and Ambient = '" + Grup + "' "
			Sql += "order by a.nom "
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				keyboard = [];
				info.recordset.forEach(element => {
					var aPes = (element.EsSumable == 0) ? emoji.get(':pizza:') : emoji.get(':hotdog:')
					keyboard.push([{ 'text': aPes + ' ' + element.nom + ' (' + element.PREU + ')', 'callback_data': 'Preus #Edit#' + BotigaCodi + '#' + BotigaNom + '#' + Grup + '#' + element.Codi }])
				})
				keyboard.push([{ 'text': '<< Back <<', 'callback_data': 'Preus #Teclat#' + BotigaCodi + '#' + BotigaNom }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					botsendMessage(msg, 'Botiga : ' + BotigaNom + '\nArticles Del Grup ' + Grup, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				})
			})
			break
		case 'Edit':
			BotigaCodi = msg.data.split('#')[2]
			BotigaNom = msg.data.split('#')[3]
			Grup = msg.data.split('#')[4]
			var Codi = msg.data.split('#')[5]

			conexion.recHit(estat[0].Valor, "select Codi,nom,PREU,EsSumable from articles where codi = " + Codi + " ").then(info => {
				keyboard = [];
				var NomArt = ''
				info.recordset.forEach(element => {
					var aPes = (element.EsSumable == 0) ? 'Unitats ' : 'Cal Pesar ';
					aPes += (element.EsSumable == 0) ? emoji.get(':pizza:') : emoji.get(':hotdog:');
					NomArt = element.nom
					//						keyboard.push([ {'text': element.nom , 'callback_data': 'Preus #EditNom#' + BotigaCodi + '#' + BotigaNom + '#' + Grup + '#' + Codi + '#' + element.nom}])
					keyboard.push([{ 'text': element.PREU, 'callback_data': 'Preus #EditPreu#' + BotigaCodi + '#' + BotigaNom + '#' + Grup + '#' + Codi + '#' + element.PREU }])
					keyboard.push([{ 'text': aPes, 'callback_data': 'Preus #EditPes#' + BotigaCodi + '#' + BotigaNom + '#' + Grup + '#' + Codi + '#' + element.EsSumable }])
				})
				keyboard.push([{ 'text': '<< Back <<', 'callback_data': 'Preus #Grup#' + BotigaCodi + '#' + BotigaNom + '#' + Grup }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					botsendMessage(msg, 'Botiga : ' + BotigaNom + '\nArticles Del Grup ' + Grup + '\nPropietats Article :' + NomArt, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				})
			})
			break;
		case 'EditPreu':
			BotigaCodi = msg.data.split('#')[2]
			BotigaNom = msg.data.split('#')[3]
			Grup = msg.data.split('#')[4]
			Codi = msg.data.split('#')[5]
			var preu = msg.data.split('#')[6]

			bot.sendMessage(msg.from.id, 'Entra El Preu (' + preu + ') :', opcionsUsusari(TipTep, true))
				.then(async msg1 => {
					const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
						bot.removeReplyListener(replyId2);
						conexion.recHit(estat[0].Valor, "Update articles Set Preu = " + msg2.text + " where codi = " + Codi + " ").then(info => {
							msg.data = 'Preus #Edit#' + BotigaCodi + '#' + BotigaNom + '#' + Grup + '#' + Codi
							Preus(msg, estat, TipTep)   // ALA recursiu
						})
					})
				})
			break;
		case 'EditPes':
			BotigaCodi = msg.data.split('#')[2]
			BotigaNom = msg.data.split('#')[3]
			Grup = msg.data.split('#')[4]
			Codi = msg.data.split('#')[5]
			var aPes = (msg.data.split('#')[6] == 'false') ? '1' : '0'

			conexion.recHit(estat[0].Valor, "Update articles Set EsSumable = " + aPes + " where codi = " + Codi + " ").then(info => {
				msg.data = 'Preus #Edit#' + BotigaCodi + '#' + BotigaNom + '#' + Grup + '#' + Codi
				Preus(msg, estat, TipTep)   // ALA recursiu
			})
			break;
		case 'Detall':
			break
	}
}


async function Tel(msg, estat, TipTep) {
	var keyboard = [];
	var t = "", off = 0;

	var Te = msg.text.substring(4, 100)
	var Sql = "select nom, valor  from clients c join  ConstantsClient cc on c.Codi =cc.Codi and variable='Tel'  and  nom like '%" + Te + "%' and len(valor)>1   "
	Sql += "union "
	Sql += "select nombre nom,valor from recursos r join recursosExtes re on r.id= re.id and re.Variable = 'TELEFONOS' and tipo = 'CONTACTO'  where nombre like '%" + Te + "%' and len(valor)>1 "
	Sql += "union "
	Sql += "select nom,telefon valor from Dependentes  where nom like '%" + Te + "%' and len(telefon)>1 "
	Sql += "order by nom "

	conexion.recHit(estat[0].Valor, Sql).then(info => {
		Te = ''
		var n = 0
		info.recordset.forEach(element => {
			n++
			if (n < 10) Te += element.nom + ' ' + element.valor + '\n'
		})
		if (n == 0) Te = 'Cap resultat'
		if (n > 10) Te += 'i ' + n + ' mes....'
		botsendMessage(msg, Te);
	})
}



async function detallVendes(msg, estat, TipTep) {
	var keyboard = [];
	var t = "";
	var today = new Date();
	var today7D = new Date();

	switch (msg.data.split(' ')[1]) {
		case 'TriaSuper':

			if (TipTep != 'GERENT') return;
			var off = 0;
			if (msg.text == undefined) {
				off = msg.data.split(' ')[2];
			} else {
				p = msg.text.split(' ');
				if (onlyDigits(p[1])) off = p[1];
			}
			today.setDate(today.getDate() - off)
			today7D.setDate(today.getDate() - 7)
			var Botigues = 'Select Codi From Paramshw';

			var Sql = "select c.CodiSup cc, c.NomSup b,c.Fran Franquicia,"
			Sql += "sum(iif(vm.data < isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.import,0)) venM,"
			Sql += "sum(iif(vm.data > isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.import,0)) venT,"
			Sql += "count(distinct iif(vm.data < isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.Num_tick,0))-1 cliM, "
			Sql += "count(distinct iif(vm.data > isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.Num_tick,0))-1 cliT, "
			Sql += "sum(iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.import,0)) venM7,"
			Sql += "sum(iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.import,0)) venT7,"
			Sql += "count(distinct iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.Num_tick,0))-1 cliM7, "
			Sql += "count(distinct iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate()))  and day(vm.data) = " + today7D.getDate() + ",vm.Num_tick,0))-1 cliT7 "
			Sql += "from "
			Sql += "(select i.codi codi,isnull(d.Memo,'NoAsignat') NomSup,d.codi CodiSup ,isnull(sf.valor,'Propia') Fran from (select * from clients  where codi in (Select Codi From Paramshw) ) i "
			Sql += "left join (Select * from constantsclient where variable = 'SupervisoraCodi' ) sc on sc.Codi = i.codi "
			Sql += "left join (Select * from constantsclient where variable = 'Franquicia' ) sf on sf.Codi = i.codi "
			Sql += "left join dependentes d on d.codi =sc.valor Where i.codi in (Select Codi From Paramshw) "
			Sql += ") c "
			Sql += "left join (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) < 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga in (" + Botigues + ") group by botiga ) Hz on c.codi = hz.Botiga  "
			Sql += "left join (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) > 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga in (" + Botigues + ") group by botiga ) Hzt on c.codi = hzt.Botiga  "
			Sql += "left join ("
			Sql += "	select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today) + " where day(data) = " + today.getDate() + " and botiga in (" + Botigues + ") group by Num_tick,botiga"
			Sql += " union "
			Sql += "  select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today7D) + " where day(data) = " + today7D.getDate() + " and botiga in (" + Botigues + ") group by Num_tick,botiga"
			Sql += ") vm on c.codi=vm.Botiga "
			Sql += "group by c.NomSup,c.CodiSup,c.Fran "
			Sql += "order by b,c.Fran "


			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var ii = 0, iif = 0, ii7 = 0, iif7 = 0
				var ci = 0, cif = 0, ci7 = 0, cif7 = 0
				info.recordset.forEach(element => {
					//btt = `${pctCara((element.venM7 + element.venT7) , (element.venM + element.venT))} ${element.b}: ${element.venM.toFixed(2)+element.venT.toFixed(2)}${pctCara(element.venM7,element.venM)} ${element.venM.toFixed(2)}(${element.cliM}) | ${pctCara(element.venT7,element.venT)} ${element.venT.toFixed(2)}(${element.cliT})`;
					var ven = element.venM + element.venT
					var ven7 = element.venM7 + element.venT7
					var nom = element.b
					nom = nom.split(' ')[0]
					nom = nom.substring(0, nom.length - nom.indexOf('_WEB'))
					var btt = ''
					if (element.Franquicia == 'Franquicia') btt += emoji.get('cherries')
					btt += pctCara(ven7, ven) + ' ' + nom + ' : '
					btt += ven.toFixed(0) + ' '
					if (element.cliT > 1) {
						btt += element.venM.toFixed(0) + pctCara(element.venM7, element.venM) + ' ' //+  emoji.get('sunny')
						btt += element.venT.toFixed(0) + pctCara(element.venT7, element.venT) //+ ' ' +  emoji.get('last_quarter_moon_with_face')
					}
					if (element.venM + element.venT > 0) keyboard.push([{ 'text': btt, 'callback_data': 'Vendes Llistat ' + off + ' ' + element.cc }]);
					if (element.Franquicia == 'Franquicia') {
						iif += element.venM + element.venT;
						iif7 += element.venM7 + element.venT7;
						cif += element.cliT + element.cliM
						cif7 += element.cliT7 + element.cliM7
					} else {
						ii += element.venM + element.venT;
						ii7 += element.venM7 + element.venT7;
						ci += element.cliT + element.cliM
						ci7 += element.cliT7 + element.cliM7
					}
				});
				t = arrayDias[today.getUTCDay()] + ' ' + sugar.Date.medium(today, 'es') + " " + pctCara((ii7 + iif7), (ii + iif)) + " Total : " + parseFloat(String(ii + iif)).toFixed(0)
				var Te = ''
				Te += arrayDias[today.getUTCDay()] + ' ' + sugar.Date.medium(today, 'es') + " \n"
				Te += '     Total : ' + pctCara(ii7 + iif7, ii + iif) + parseFloat(String(ii + iif)).toFixed(0) + emoji.get('moneybag')
				Te += pctCara(ci7 + cif7, ci + cif) + ' ' + parseFloat(String(ci + cif)).toFixed(0) + emoji.get('bust_in_silhouette')
				Te += pctCara((ii7 + iif7) / (ci7 + cif7), (ii + iif) / (ci + cif)) + ' ' + parseFloat(String((ii + iif) / (ci + cif))).toFixed(2) + emoji.get('eyeglasses') + " \n"
				if (iif > 0) {
					Te += '     Propias : ' + pctCara(ii7, ii) + parseFloat(String(ii)).toFixed(0) + emoji.get('moneybag')
					Te += pctCara(ci7, ci) + ' ' + parseFloat(String(ci)).toFixed(0) + emoji.get('bust_in_silhouette')
					Te += pctCara(ii7 / ci7, ii / ci) + ' ' + parseFloat(String(ii / ci)).toFixed(2) + emoji.get('eyeglasses') + " \n"
					Te += 'Franquicies  : ' + pctCara(iif7, iif) + parseFloat(String(iif)).toFixed(0) + emoji.get('moneybag')
					Te += pctCara(cif7, cif) + ' ' + parseFloat(String(cif)).toFixed(0) + emoji.get('bust_in_silhouette')
					Te += pctCara(iif7 / cif7, iif / cif) + ' ' + parseFloat(String(iif / cif)).toFixed(2) + emoji.get('eyeglasses') + " \n"
				}
				keyboard.push([{ 'text': t, 'callback_data': 'Vendes DetallDia ' + 33 }]);
				botsendMessage(msg, Te, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			})
			break;
		case 'TriaDia':
			switch (TipTep) {
				case 'FRANQUICIA':
					Sql = "select codi from ConstantsClient where variable = 'userFranquicia' and valor = " + estat[0].CodiUser + " ";
					break;
				default:
					Sql = "Select codi from constantsclient where variable = 'SupervisoraCodi' and valor = " + estat[0].CodiUser;
					break;
			}
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var Botigues = '';
				for (var i = 0; i < info.rowsAffected; i++) {
					if (Botigues != '') Botigues += ',';
					Botigues += info.recordset[i].codi;
				}
				today7D.setDate(today.getDate() - 7)
				if (Botigues == '') Botigues = "Select Codi From Paramshw";

				Sql = "select c.codi cc, c.nom b,"
				Sql += "sum(iif(vm.data < isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.import,0)) venM,"
				Sql += "sum(iif(vm.data > isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.import,0)) venT,"
				Sql += "count(distinct iif(vm.data < isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.Num_tick,0))-1 cliM, "
				Sql += "count(distinct iif(vm.data > isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.Num_tick,0))-1 cliT, "

				Sql += "sum(iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.import,0)) venM7,"
				Sql += "sum(iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.import,0)) venT7,"
				Sql += "count(distinct iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.Num_tick,0))-1 cliM7, "
				Sql += "count(distinct iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate()))  and day(vm.data) = " + today7D.getDate() + ",vm.Num_tick,0))-1 cliT7 "

				Sql += "from (Select Codi,nom From clients  Where codi in (" + Botigues + ")) c "
				Sql += "left join (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) < 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga in (" + Botigues + ") group by botiga ) Hz on c.codi = hz.Botiga  "
				Sql += "left join (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) > 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga in (" + Botigues + ") group by botiga ) Hzt on c.codi = hzt.Botiga  "
				Sql += "left join ("
				Sql += "	select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today) + " where day(data) = " + today.getDate() + " and botiga in (" + Botigues + ") group by Num_tick,botiga"
				Sql += " union "
				Sql += "  select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today7D) + " where day(data) = " + today7D.getDate() + " and botiga in (" + Botigues + ") group by Num_tick,botiga"
				Sql += ") vm on c.codi=vm.Botiga "
				Sql += "group by c.nom, c.codi "


				//			botsendMessage(msg,Sql);
				//conexion.recHit(estat[0].Valor, Sql).then(info => {

			});
			keyboard.push([{ 'text': 'Avui', 'callback_data': 'Vendes Llistat 0' }]);
			keyboard.push([{ 'text': 'Ahir', 'callback_data': 'Vendes Llistat 1' }]);
			keyboard.push([{ 'text': 'La Setmana Pasada', 'callback_data': 'Vendes Llistat 7' }]);
			keyboard.push([{ 'text': 'l Any Passat', 'callback_data': 'Vendes Llistat 364' }]);
			botsendMessage(msg, 'Data de les Vendes ? ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			break;
		case 'Llistat':
			var off = 0;
			if (msg.text == undefined) {
				off = msg.data.split(' ')[2];
			} else {
				var p = msg.text.split(' ');
				if (onlyDigits(p[1])) off = p[1];
			}
			today.setDate(today.getDate() - off)
			switch (TipTep) {
				case 'FRANQUICIA':
					Sql = "select codi from ConstantsClient where variable = 'userFranquicia' and valor = " + estat[0].CodiUser + " ";
					break;
				case 'GERENT':
				case 'GERENT_2':
					if (msg.data.split(' ')[3] == undefined) {
						Sql = "Select distinct valor from constantsclient where variable = 'SupervisoraCodi' ";
					} else {
						Sql = "Select codi from constantsclient where variable = 'SupervisoraCodi' and valor = " + msg.data.split(' ')[3];
					}
					break;
				default:
					Sql = "Select codi from constantsclient where variable = 'SupervisoraCodi' and valor = " + estat[0].CodiUser;
					break;
			}
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var Botigues = '';
				if (Sql == "Select distinct valor from constantsclient where variable = 'SupervisoraCodi' ") {
					if (info.rowsAffected > 3) {  // es un gerent amb supervisores
						msg.data = "Vendes TriaSuper " + off
						detallVendes(msg, estat, TipTep)
						return;
					}
				} else {
					for (var i = 0; i < info.rowsAffected; i++) {
						if (Botigues != '') Botigues += ',';
						Botigues += info.recordset[i].codi;
					}
				}
				today7D.setDate(today.getDate() - 7)
				if (Botigues == '') Botigues = "Select distinct botiga from " + nomTaulaVenut(today) + "  where day(data) = " + today.getDate() + " ";

				Sql = "select c.codi cc, c.nom b,"
				Sql += "sum(iif(vm.data < isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.import,0)) venM,"
				Sql += "sum(iif(vm.data > isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.import,0)) venT,"
				Sql += "count(distinct iif(vm.data < isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.Num_tick,0))-1 cliM, "
				Sql += "count(distinct iif(vm.data > isnull(hz.data,getdate()) and day(vm.data) = " + today.getDate() + ",vm.Num_tick,0))-1 cliT, "

				Sql += "sum(iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.import,0)) venM7,"
				Sql += "sum(iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.import,0)) venT7,"
				Sql += "count(distinct iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) and day(vm.data) = " + today7D.getDate() + ",vm.Num_tick,0))-1 cliM7, "
				Sql += "count(distinct iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate()))  and day(vm.data) = " + today7D.getDate() + ",vm.Num_tick,0))-1 cliT7 "

				Sql += "from (Select Codi,nom From clients  Where codi in (" + Botigues + ")) c "
				Sql += "left join (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) < 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga in (" + Botigues + ") group by botiga ) Hz on c.codi = hz.Botiga  "
				Sql += "left join (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) > 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga in (" + Botigues + ") group by botiga ) Hzt on c.codi = hzt.Botiga  "
				Sql += "left join ("
				Sql += "	select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today) + " where day(data) = " + today.getDate() + " and botiga in (" + Botigues + ") group by Num_tick,botiga"
				Sql += " union "
				Sql += "  select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today7D) + " where day(data) = " + today7D.getDate() + " and botiga in (" + Botigues + ") group by Num_tick,botiga"
				Sql += ") vm on c.codi=vm.Botiga "
				Sql += "group by c.nom, c.codi "


				//botsendMessage(msg,Sql);
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					var ii = 0;
					var totalDiaPrevisio = 0;
					info.recordset.forEach(element => {
						//btt = `${pctCara((element.venM7 + element.venT7) , (element.venM + element.venT))} ${element.b}: ${element.venM.toFixed(2)+element.venT.toFixed(2)}${pctCara(element.venM7,element.venM)} ${element.venM.toFixed(2)}(${element.cliM}) | ${pctCara(element.venT7,element.venT)} ${element.venT.toFixed(2)}(${element.cliT})`;
						var ven = element.venM + element.venT
						var ven7 = element.venM7 + element.venT7
						var btt = pctCara(ven7, ven) + ' ' + element.b + ' : '
						btt += ven.toFixed(0) + ' '
						if (element.cliT > 1) {
							btt += element.venM.toFixed(0) + pctCara(element.venM7, element.venM) + ' ' //+  emoji.get('sunny')
							btt += element.venT.toFixed(0) + pctCara(element.venT7, element.venT) //+ ' ' +  emoji.get('last_quarter_moon_with_face')
						}

						keyboard.push([{ 'text': btt, 'callback_data': 'Vendes Detall ' + element.cc + ' ' + off + ' ' + msg.message_id }]);
						ii += element.venM + element.venT;
						totalDiaPrevisio += (element.venM7 + element.venT7);
					});

					t = arrayDias[today.getUTCDay()] + ' ' + sugar.Date.medium(today, 'es') + " " + pctCara(totalDiaPrevisio, ii) + " Total : " + parseFloat(String(ii)).toFixed(2);
					keyboard.push([{ 'text': t, 'callback_data': 'Vendes DetallDia ' + 33 }]);
					botsendMessage(msg, "Vendes", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				});
			});
			break;
		case 'Detall':
			var codiBotiga = msg.data.split(' ')[2];
			off = msg.data.split(' ')[3];
			today = new Date();
			today.setDate(today.getDate() - off)
			today7D = new Date();
			today7D.setDate(today.getDate() - 7)
			Sql = "select format(max(isnull(hz.data,getdate())) ,'HH:mm') i, 'Dades' t ,format(sum(iif(vm.data < isnull(hz.data,getdate()),vm.import,0)),'0.00') venM,format(sum(iif(vm.data > isnull(hz.data,getdate()),vm.import,0)),'0.00') venT  "
			Sql += ",count(distinct iif(vm.data < isnull(hz.data,getdate()),vm.Num_tick,0))-1 cliM, "
			Sql += "count(distinct iif(vm.data > isnull(hz.data,getdate()),vm.Num_tick,0))-1 cliT "
			Sql += "from (Select Codi,nom From clients  Where codi = " + codiBotiga + ") c "
			Sql += "left join  (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) < 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga  = " + codiBotiga + " group by botiga ) Hz on c.codi = hz.Botiga  "
			Sql += "left join (select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today) + " where day(data) = " + today.getDate() + " and botiga = " + codiBotiga + " group by Num_tick,botiga) vm on c.codi=vm.Botiga "

			Sql += "union select format(max(isnull(hz.data,getdate())) ,'HH:mm') i, 'Dades7D' t ,"
			Sql += "format(sum(iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) ,vm.import,0)),'0.00') venM,"
			Sql += "format(sum(iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate())) ,vm.import,0)),'0.00') venT,"
			Sql += "format(count(distinct iif(vm.data < DATEADD(day,-7,isnull(hz.data,getdate())) ,vm.Num_tick,0))-1,'0') cliM, "
			Sql += "format(count(distinct iif(vm.data > DATEADD(day,-7,hz.data) and vm.data < DATEADD(day,-7,isnull(hzt.data,getdate())),vm.Num_tick,0))-1,'0') cliT "

			Sql += "from (Select Codi,nom From clients  Where codi = " + codiBotiga + ") c "
			Sql += "left join  (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) < 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga  = " + codiBotiga + " group by botiga ) Hz on c.codi = hz.Botiga  "
			Sql += "left join  (select botiga,max(data) data from " + nomTaulaMoviments(today) + "  where datepart(hour,data) > 16 and  day(data) = " + today.getDate() + " and Tipus_moviment = 'Z' and Botiga  = " + codiBotiga + " group by botiga ) Hzt on c.codi = hzt.Botiga  "
			Sql += "left join (select Num_tick,botiga,sum(import) import,max(data) data from " + nomTaulaVenut(today7D) + " where day(data) = " + today7D.getDate() + " and botiga = " + codiBotiga + " group by Num_tick,botiga) vm on c.codi=vm.Botiga "

			Sql += "union select distinct format(isnull(sum(import),0),'0.00') i , 'TARDA' t , '' venM , '' venT, '' cliM, '' cliT   from " + nomTaulaMoviments(today) + " where tipus_moviment ='TARDA' and botiga = " + codiBotiga + "  and day(data) = " + today.getDate() + " ";
			Sql += "union select distinct format(isnull(sum(import),0),'0.00') i , 'MATI'  t , '' venM , '' venT, '' cliM, '' cliT   from " + nomTaulaMoviments(today) + " where tipus_moviment ='MATI'  and botiga = " + codiBotiga + "  and day(data) = " + today.getDate() + " ";
			Sql += "union select nom i , 'Nom' t, '' venM , '' venT, '' cliM, '' cliT   from clients where codi = " + codiBotiga + " "
			//botsendMessage(msg,Sql)				
			conexion.recHit(estat[0].Valor, Sql).then(RsIdCli => {
				var cM: any = '', cT: any = '', vM: any = '', vT: any = '', nomB: any = '', pM: any = '', pT: any = '', z: any = '';
				var cM7: any = '', cT7: any = '', vM7: any = '', vT7: any = '', z7: any = '';
				var v: any = '', c: any = '', v7: any = '', c7: any = '', p: any = '';
				for (var i = 0; i < RsIdCli.rowsAffected; i++) {
					if (RsIdCli.recordset[i].t == 'MATI') pM = RsIdCli.recordset[i].i;
					if (RsIdCli.recordset[i].t == 'TARDA') pT = RsIdCli.recordset[i].i;
					if (RsIdCli.recordset[i].t == 'Dades') vM = RsIdCli.recordset[i].venM;
					if (RsIdCli.recordset[i].t == 'Dades') cM = RsIdCli.recordset[i].cliM;
					if (RsIdCli.recordset[i].t == 'Dades') vT = RsIdCli.recordset[i].venT;
					if (RsIdCli.recordset[i].t == 'Dades') cT = RsIdCli.recordset[i].cliT;
					if (RsIdCli.recordset[i].t == 'Dades') z = RsIdCli.recordset[i].i;

					if (RsIdCli.recordset[i].t == 'Dades7D') vM7 = RsIdCli.recordset[i].venM;
					if (RsIdCli.recordset[i].t == 'Dades7D') cM7 = RsIdCli.recordset[i].cliM;
					if (RsIdCli.recordset[i].t == 'Dades7D') vT7 = RsIdCli.recordset[i].venT;
					if (RsIdCli.recordset[i].t == 'Dades7D') cT7 = RsIdCli.recordset[i].cliT;
					if (RsIdCli.recordset[i].t == 'Dades7D') z7 = RsIdCli.recordset[i].i;
					if (RsIdCli.recordset[i].t == 'Nom') nomB = RsIdCli.recordset[i].i;
				};
				var Txt = '';
				v = parseFloat(vM) + parseFloat(vT)
				v7 = parseFloat(vM7) + parseFloat(vT7)
				p = parseFloat(pM) + parseFloat(pT)
				c = parseFloat(cM) + parseFloat(cT)
				c7 = parseFloat(cM7) + parseFloat(cT7)
				Txt += " Detall  Botiga " + nomB + "  " + arrayDias[today.getUTCDay()] + ' ' + sugar.Date.medium(today, 'es') + "\n";
				Txt += ".............Total.............\n";
				Txt += "Venut		: " + parseFloat(v).toFixed(0);
				Txt += " -7	: " + parseFloat(v7).toFixed(0) + " " + parseFloat(String((1 - v7 / v) * 100)).toFixed(0) + " %" + pctCara(v7, v) + "\n";
				Txt += "Clients	: " + c + "";
				Txt += " -7	: " + c7 + " " + parseFloat(String((1 - c7 / c) * 100)).toFixed(0) + " %" + pctCara(c7, c) + "\n";
				Txt += "Tick Mitg	: " + parseFloat(String(v / c)).toFixed(2) + "";
				Txt += " -7	: " + parseFloat(String(v7 / c7)).toFixed(2) + " " + parseFloat(String((1 - (v7 / c7) / (v / c)) * 100)).toFixed(0) + " %" + pctCara((v7 / c7), (v / c)) + "\n";
				Txt += "Previsio 	: " + parseFloat(p).toFixed(0) + "\n";
				if (cT > 0) {
					Txt += ".............Mati.............\n";
					Txt += "Venut		: " + parseFloat(vM).toFixed(0);
					Txt += " -7	: " + parseFloat(vM7).toFixed(0) + " " + parseFloat(String((1 - vM7 / vM) * 100)).toFixed(0) + " %" + pctCara(vM7, vM) + "\n";
					Txt += "Clients	: " + cM + "";
					Txt += " -7	: " + cM7 + " " + parseFloat(String((1 - cM7 / cM) * 100)).toFixed(0) + " %" + pctCara(cM7, cM) + "\n";
					Txt += "Tick Mitg	: " + parseFloat(String(vM / cM)).toFixed(2) + "";
					Txt += " -7	: " + parseFloat(String(vM7 / cM7)).toFixed(2) + " " + parseFloat(String((1 - (vM7 / cM7) / (vM / cM)) * 100)).toFixed(0) + " %" + pctCara((vM7 / cM7), (vM / cM)) + "\n";
					Txt += "Previsio 	: " + parseFloat(pM).toFixed(0) + "\n";
					Txt += ".............Tarda.............\n";
					Txt += "Venut		: " + parseFloat(vT).toFixed(0);
					Txt += " -7	: " + parseFloat(vT7).toFixed(0) + " " + parseFloat(String((1 - vT7 / vT) * 100)).toFixed(0) + " %" + pctCara(vT7, vT) + "\n";
					Txt += "Clients	: " + cT + "";
					Txt += " -7	: " + cT7 + " " + parseFloat(String((1 - cT7 / cT) * 100)).toFixed(0) + " %" + pctCara(cT7, cT) + "\n";
					Txt += "Tick Mitg	: " + parseFloat(String(vT / cT)).toFixed(2) + "";
					Txt += " -7	: " + parseFloat(String(vT7 / cT7)).toFixed(2) + " " + parseFloat(String((1 - (vT7 / cT7) / (vT / cT)) * 100)).toFixed(0) + " %" + pctCara((vT7 / cT7), (vT / cT)) + "\n";
					Txt += "Previsio 	: " + parseFloat(pT).toFixed(0) + "\n";
				}
				keyboard = []
				msg.message.reply_markup.inline_keyboard.forEach(element => {
					keyboard.push(element)
				});
				bot.deleteMessage(msg.from.id, msg.message.message_id)
				botsendMessage(msg, Txt, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			});
			break
	}
}

function nomTaulaVenut(d) {
	return "[V_Venut_" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "]";
}

function nomTaulaFaltas(d) {
	return "[V_Faltas_" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "]"
}

function nomTaulaMoviments(d) {
	return "[V_Moviments_" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "]";
}
function nomTaulaServit(d) {
	return "[Servit-" + ("0" + (d.getFullYear())).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2) + "]"
}


//Menu - Menu Principal
//Vendes - Menu de Vendes


function opcionsUsusari(TipTep, ForceReply = false) {
	if (ForceReply) {
		return { reply_markup: JSON.stringify({ force_reply: true }), };
	} else {
		//		console.log(TipTep)
		switch (TipTep) {
			case 'GERENT':
			case 'GERENT_2':
			case 'ADMINISTRACIO':
			case 'CONTABILITAT':
			case 'RESPONSABLE':
			case 'FRANQUICIA':
				return {
					reply_markup: JSON.stringify({
						keyboard: [
							[{ text: 'Botiga', 'callback_data': 'Botiga' }],
							[{ text: 'Fichar', 'callback_data': 'Fichar Menu' }],
							[{ text: 'Incidencies', 'callback_data': 'incidencies' }]
						], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
					}),
				};
			case 'FORNER':
			case 'PASTISSER':
			case 'PRODUCCIO':
				return {
					reply_markup: JSON.stringify({
						keyboard: [
							[{ text: 'Llistats', 'callback_data': 'Llistats TriaEquip' }],
							[{ text: 'Comandes', 'callback_data': 'Comandes ' }],
							[{ text: 'Configura', 'callback_data': 'Cfg ' }]
						], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
					}),
				};
			case 'AUXILIAR':
			case 'BOLLERIA':
			case 'CAMBRER':
			case 'CUINER':
			case 'DEPENDENTA':
			case 'FORNER':
			case 'GESTOR DE PRODUCTE':
			case 'NETEJA':
			case 'REPARTIDOR':
			default:
				return {
					reply_markup: JSON.stringify({
						keyboard: [
							[{ text: 'Botigues', 'callback_data': 'PosBotigues' }],
							[{ text: 'Fichar', 'callback_data': 'Fichar Ficha' }]
						], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
					}),
				};
		}
	}
}

function accio(msg) {

	if (msg.text !== undefined && msg.text.toUpperCase().substring(0, 2) == 'V ') msg.data = 'Vendes Llistat ' + msg.text.substring(2, 100);
	if (msg.text !== undefined && msg.text.toUpperCase() == 'V') msg.data = 'Vendes Llistat';
	if (msg.text !== undefined && msg.text.toUpperCase() == 'P') msg.data = 'Productes';
	if (msg.text !== undefined && msg.text.toUpperCase() == 'I') msg.data = 'Inventari';
	if (msg.text !== undefined && msg.text.split(' ')[0].toUpperCase() == 'TEL') msg.data = 'Tel';
	if (msg.text !== undefined && msg.text.toUpperCase() == 'VENDES') msg.data = 'Vendes TriaDia';
	if (msg.text !== undefined && msg.text.toUpperCase().substring(0, 2) == 'L ') msg.data = 'Llicencies';
	if (msg.text !== undefined && msg.text.toUpperCase().substring(0, 2) == 'NS') msg.data = 'NumeroSerie';
	if (msg.text !== undefined && msg.text.toUpperCase() == 'C') return 'comandero';
	if (msg.text !== undefined && msg.text.toUpperCase() == 'F') return 'Fichar';
	if (msg.text !== undefined && msg.text.toUpperCase() == 'E') return 'Enquesta';

	if (msg.text !== undefined && msg.text == 'Fotos') return 'VerFotos';
	if (msg.photo !== undefined) return 'photo';

	if (msg.data !== undefined && msg.data.split(' ')[0].length > 0) return msg.data.split(' ')[0];
	if (msg.data !== undefined) return msg.data;
	if (msg.text !== undefined) return msg.text;
}


async function BotContesta(msg, estat, TipTep) {
	var acc = accio(msg);

	//if (!nombresDeDios.indexOf(msg.from.id)) bot.sendMessage('911219941', msg.from.first_name + " Diu : " + acc );  // me lo mando a mi pa verlo to....
	console.log(acc);
	var NouEstat;
	switch (TipTep) {
		case 'GERENT':
		case 'GERENT_2':
		case 'ADMINISTRACIO':
		case 'CONTABILITAT':
		case 'RESPONSABLE':
		case 'FRANQUICIA':
			switch (acc) {
				case "Fichar":
					Fichar(msg, estat, TipTep);
					return;
				case "Enquesta":
					Enquesta(msg, estat, TipTep);
					return;
				case "Vendes":
					NouEstat = detallVendes(msg, estat, TipTep).then(NouEstat => { return NouEstat; });
					return;
				case "Productes":
					NouEstat = detallProductes(msg, estat, TipTep).then(NouEstat => { return NouEstat; });
					return;
				case "Inventari":
					NouEstat = inventari(msg, estat, TipTep).then(NouEstat => { return NouEstat; });
					return;
				case "detallDia":
					//NouEstat= detallDia(msg,estat).then(NouEstat => {return NouEstat;});	
					return;
				case "Llicencies":
					NouEstat = getLicencia(msg, estat).then(NouEstat => { return NouEstat; });
					return;
				case "NumeroSerie":
					NouEstat = guardarNumeroSerie(msg, estat).then(NouEstat => { return NouEstat; });
					return;
				case "NumeroSerieBoton":
					NouEstat = actualizarDatosBoton(msg, estat).then(NouEstat => { return NouEstat; });
					return;
				case "Preus":
					NouEstat = Preus(msg, estat, TipTep).then(NouEstat => { return NouEstat; });
					return;
				case "Tel":
					NouEstat = Tel(msg, estat, TipTep).then(NouEstat => { return NouEstat; });
					return;

			}
		case 'AUXILIAR':
		case 'BOLLERIA':
		case 'CAMBRER':
		case 'CUINER':
		case 'DEPENDENTA':
		case 'FORNER':
		case 'GESTOR DE PRODUCTE':
		case 'NETEJA':
		case 'PASTISSER/FORNER':
		case 'PRODUCCIO':
		case 'REPARTIDOR':
			switch (acc) {
				case "comandero":
					NouEstat = comandero(msg, estat).then(NouEstat => { return NouEstat; });
					return;
				case "Vendes":
				case "detallDia":
					botsendMessage(msg, 'Tens un perfil d usuari de : ' + TipTep + ' No pots accedir a aquesta informaci� ');
					return;
				case 'FotoPujada':
					botGuardaFoto(msg, estat);
					return;
				case "photo":
					botGuardaFoto(msg, estat);
					return;
				case "VerFotos":
					botRespondeFoto(msg, estat);
					return;
				case "Cfg":
				case "Configura":
					Cfg(msg, estat, TipTep);
					return;
				case "Comandes":
					Comandes(msg, estat, TipTep);
					return;
				case "Llistats":
					Llistats(msg, estat, TipTep);
					return;
			}
		default:
			switch (acc) {
				case "Su":
					console.log("BUSCANDO A SU");
					if (nombresDeDios.indexOf(msg.from.id) || TipTep == 'GERENT') {
						logaSu(msg, estat);
						return;
					}
				case "VersioBotMenu":
				case "VersioBotNew":
				case "VersioBotAddComentari":
					if (nombresDeDios.indexOf(msg.from.id)) {
						switch (acc) {
							case "VersioBotMenu":
								botsendMessage(msg, 'Opcions Admin Bot', { reply_markup: JSON.stringify({ inline_keyboard: [[{ 'text': 'Add Comentari', 'callback_data': 'VersioBotAddComentari' }], [{ 'text': 'No', 'callback_data': '--' }]] }) });
								return;
							case "VersioBotAddComentari":
								botsendMessage(msg, 'Entra Comentari x seguent versio:', opcionsUsusari(TipTep, true));
								return;
							case "VersioBotNew":
								return;
						}
					} else { botsendMessage(msg, 'Nomes Deu pot fer aixo !!'); return; }
				case "ComandaClientSi":
					var opt = { "parse_mode": "Markdown", "reply_markup": { "one_time_keyboard": true, "keyboard": [[{ text: "My location", request_location: true }], ["Cancel"]] } };
					botsendMessage(msg, 'Posat a pocs metres de la botiga i enviam la teva Posicio', opt);
					return;
				case "ComandaClientNo":
					botsendMessage(msg, 'Doncs quan vulguis ja ho saps..... ');
					return;
				case 'Principal':
					botsendMessage(msg, 'Tria Una Opcio...', opcionsUsusari(TipTep, false));
					return;
				case "Botiga":
					botsendMessage(msg, 'Opcions de Botigues', {
						reply_markup: JSON.stringify({
							keyboard: [
								[{ text: 'Principal', 'callback_data': 'Principal' }],
								[{ text: 'Vendes', 'callback_data': 'Vendes TriaDia' }],
								[{ text: 'comandero', 'callback_data': 'comandero' }],
								[{ text: 'Tecnic', 'callback_data': 'Tecnic' }]
							], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
						}),
					});
				case "Incidencies":
					incidencies(msg, estat, TipTep);
					return;
				case "Tecnic":
					tecnic(msg, estat, TipTep);
					return;
				case "Iphone":
					const opts = { reply_markup: JSON.stringify({ keyboard: [[{ text: 'Contact', request_contact: true }],], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true, }), };
					botsendMessage(msg, 'Tornam a Enviar el teu numero de telefon.', opts);
					return;
				default:
					//					botsendMessage(msg, 'Hola !! \nDegut al confinament pots fer la comanda per Telegram.\nVols fer una comanda i t avisem cuan la puguis passar a recollir ? ',{reply_markup: JSON.stringify({inline_keyboard: [[{'text': 'Si', 'callback_data': 'ComandaClientSi'}],[{'text': 'No', 'callback_data': 'ComandaClientNo'}]]})});
					//					botsendMessage(msg, msg.text + ' ?' + "\n No se que contestar ...");
					return;
			}
	}
}

function mainBot(msg, contesta = true): Promise<loginObject> {
	var estat = [{}];
	var devolver: Promise<loginObject> = new Promise((dev, rej) => {
		conexion.recHit('Hit', "select empresa,usuario from Secretaria where aux1='" + msg.from.id + "'").then(RsIdCli => {
			if (RsIdCli.rowsAffected > 0) {
				var Cli_Emp = RsIdCli.recordset[0].empresa;
				var Cli_Tel = RsIdCli.recordset[0].usuario;
				var Cli_Nom = msg.from.first_name;
				var Sql = "select d.codi Codi,d.nom,de.valor from ( ";
				Sql += "select id as codi from dependentesExtes where nom='TLF_MOBIL' and   ";
				Sql += "(valor = '" + Cli_Tel + "' or '+34' + valor = '" + Cli_Tel + "') union   ";
				Sql += "select id as codi from dependentesExtes where nom='TLF_MOBIL' and   ";
				Sql += "(valor = '" + Cli_Tel + "' or '34' + valor = '" + Cli_Tel + "') union   ";
				Sql += "select codi from dependentes where   ";
				Sql += "(telefon = '" + Cli_Tel + "' or '+34' + telefon = '" + Cli_Tel + "') union ";
				Sql += "select codi from dependentes where   ";
				Sql += "(telefon = '" + Cli_Tel + "' or '34' + telefon = '" + Cli_Tel + "') ";
				Sql += "	) a   ";
				Sql += "join dependentes d on d.codi = a.codi   "
				Sql += "join (select * from dependentesextes where nom = 'TIPUSTREBALLADOR') de on d.codi=de.id  "

				conexion.recHit(Cli_Emp, Sql).then(RsTipTep => {
					var TipTep = "ClientNoIdentificat";
					var Cli_Codi = 0

					if (RsTipTep.rowsAffected > 0) {
						TipTep = RsTipTep.recordset[0].valor;
						Cli_Codi = RsTipTep.recordset[0].Codi;
						Cli_Nom = RsTipTep.recordset[0].nom
						estat = [{ 'id': new Date(), 'TimeStamp': new Date(), 'CodiUser': Cli_Codi, 'Variable': 'Cli_Emp', 'Valor': Cli_Emp, 'Texte': 'Estat inicial Autocreat', 'Auxiliar1': Cli_Nom, 'Auxiliar2': '.', 'Auxiliar3': '.', 'Auxiliar4': '.' }];
						if (contesta) BotContesta(msg, estat, TipTep).then(NouEstat => { });
						var sesion: loginObject = {
							error: false,
							database: Cli_Emp,
							telefono: Cli_Tel,
							nombre: Cli_Nom,
							tipoUsuario: TipTep,
							idTrabajador: Cli_Codi
						};
						dev(sesion);
					}
					else {
						bot.sendPhoto(msg.from.id, 'help.jpg', { caption: 'Hem canviat coses..... Tornam a Enviar el teu numero de telefon.' });
						const opts = { reply_markup: JSON.stringify({ keyboard: [[{ text: 'Contact', request_contact: true }],], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true, }), };
						botsendMessage(msg, 'Hem canviat coses..... Tornam a Enviar el teu numero de telefon.', opts);
						var sesion: loginObject = {
							error: true
						};
						dev(sesion);
					}
				});
			}
			else {
				bot.sendPhoto(msg.from.id, 'help.jpg', { caption: 'No et tinc fixat. Enviam el teu numero de telefon.' });
				const opts = { reply_markup: JSON.stringify({ keyboard: [[{ text: 'Contact', request_contact: true }],], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true, }), };
				botsendMessage(msg, 'No et tinc fixat. Enviam el teu numero de telefon.', opts);
				var sesion: loginObject = {
					error: true
				};
				dev(sesion);
			}
		});
	});
	return devolver;
}

function tecnic(msg, estat, TipTep) {
	var keyboard = [];
	if (msg.data === undefined || msg.data.split(' ')[1].length == 0) {
		botsendMessage(msg, 'Opcions de Botigues', {
			reply_markup: JSON.stringify({
				inline_keyboard: [
					[{ text: 'Totes Les Botigues', 'callback_data': 'Tecnic Botigues Totes' }],
					[{ text: 'Botigues Averiades', 'callback_data': 'Tecnic Botigues Averiades' }],
					[{ text: 'Incidencies', 'callback_data': 'Tecnic Incidencies' }]
				], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
			}),
		});
	}
	if (msg.data === undefined) return 0;

	if (msg.data.split(' ')[1] == 'Botigues') {
		switch (TipTep) {
			case 'FRANQUICIA':
				var Sql = "select codi from ConstantsClient where variable = 'userFranquicia' and valor = " + null + " ";
				break;
			default:
				Sql = "Select codi from constantsclient where variable = 'SupervisoraCodi' and valor = " + estat[0].CodiUser;
				break;
		}
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			var Botigues = '';
			for (var i = 0; i < info.rowsAffected; i++) {
				if (Botigues != '') Botigues += ',';
				Botigues += info.recordset[i].codi;
			}

			Sql = "select isnull(datediff(minute,rr.TimeStamp ,r.TimeStamp ),0) MinutsPulsat ,isnull(datediff(Minute, p.Tmst, getdate()),99999)   ImpTmst ,c.nom Nom,c.codi Codi, datediff(Minute, v.Tmst, getdate()) TpvTmst,v.i  from clients c ";
			Sql += "left join ( ";
			Sql += "select pm.llicencia botiga ,pm.tmst Tmst,pm.Param2 i ,pm.Param3 c  from PingMaquina pm join  ";
			Sql += "(select llicencia,max(TmSt) tmstM from PingMaquina group by llicencia) u ";
			Sql += "on pm.TmSt = u.tmstM and pm.Llicencia = u.Llicencia  ";
			Sql += ") v on c.codi=v.Botiga   ";
			Sql += "left join ( ";
			Sql += "select * from hit.dbo.ImpresorasIp  where empresa = '" + estat[0].Valor + "' ";
			Sql += ") p on p.nom = 'produccio_' + cast(c.codi as varchar) + '_Tot' ";
			Sql += "left join Records r  on r.concepte = 'ImpresionBocadillosBotoPulsat' + cast(c.codi as nvarchar) ";
			Sql += "left join Records rr on rr.concepte = 'ImpresionBocadillosBotoPenultimPulsat' + cast(c.codi as nvarchar) ";
			Sql += " Where 1=1 ";
			if (msg.data.split(' ')[2] == 'Averiades') Sql += " And (isnull(datediff(Minute, p.Tmst, getdate()),99999) > 5 or  datediff(Minute, v.Tmst, getdate()) > 15) "
			if (Botigues != '') Sql += " And c.codi in (" + Botigues + ") ";
			Sql += "order by c.nom ";
			//botsendMessage(msg, Sql);
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				var ii = 0;
				var Cap = true;
				info.recordset.forEach(element => {
					Cap = false;
					var Emocio = " \u{1F604}";
					if (element.TpvTmst > 10) Emocio = " \u{1F604}";
					if (element.TpvTmst > 100) Emocio = " \u{1F648}";
					if (element.TpvTmst > 10) Emocio = " \u{1F648}";
					if (element.ImpTmst > 99990) {
						var Emocio2 = " \u{1F604}";
						if (element.ImpTmst > 10) Emocio2 = " \u{1F604}";
						if (element.ImpTmst > 100) Emocio2 = " \u{1F648}";
						if (Emocio2 != " \u{1F604}") keyboard.push([{ 'text': element.Nom + " " + Emocio + " ", 'callback_data': 'Tecnic Botiga Menu ' + element.Codi }]);
					} else {
						Emocio2 = " \u{1F604}";
						if (element.ImpTmst > 10) Emocio2 = " \u{1F604}";
						if (element.ImpTmst > 100) Emocio2 = " \u{1F648}";
						keyboard.push([{ 'text': element.Nom + " " + Emocio + " ", 'callback_data': 'Tecnic Botiga Menu ' + element.Codi },
						{ 'text': " Impresora " + element.MinutsPulsat + " " + Emocio2 + " ", 'callback_data': 'Tecnic Impresora Menu ' + element.Codi }
						]);
					}
				});
				var Te = ' Fallos De Conexio : ';
				if (Cap) Te = ' \u{1F604} \u{1F604} \u{1F604} CAP AVERIA \u{1F604} \u{1F604} \u{1F604}';
				botsendMessage(msg, Te, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			});
		});
	}

	if (msg.data.split(' ')[1] == 'Impresora') {
		if (msg.data.split(' ')[2] == 'Menu')
			botsendMessage(msg, 'Impresora ' + msg.data.split(' ')[3], { reply_markup: JSON.stringify({ inline_keyboard: [[{ 'text': 'Impresora Info', 'callback_data': 'Tecnic Impresora Info ' + msg.data.split(' ')[3] }], [{ 'text': 'Impresora Pita', 'callback_data': 'Tecnic Impresora Pita ' + msg.data.split(' ')[3] }], [{ 'text': 'Impresora Pinta', 'callback_data': 'Tecnic Impresora Pinta ' + msg.data.split(' ')[3] }]] }) });
		if (msg.data.split(' ')[2] == 'Info') {
			Sql = "select * from hit.dbo.ImpresorasIp  where empresa = '" + estat[0].Valor + "' and nom = 'produccio_" + msg.data.split(' ')[3] + "_Tot'";
			var Te = 'Info impresora : ';
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				info.recordset.forEach(element => {
					Te += '\n Ultima Connexio : ' + element.TmSt;
					Te += '\n Mac : ' + element.Mac;
				});
				Sql = "select id,impresora,descripcio,texte,tmstPeticio,TmStImpres,Estat from ImpresoraCola where impresora = 'produccio_" + msg.data.split(' ')[3] + "_Tot'";
				Te += '\n.....................................................';
				Te += '\nPendents Impresio : ';
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					info.recordset.forEach(element => {
						Te += '\nHora :' + element.tmstPeticio;
						Te += '\n' + element.texte;
					});
					Te += '\n.....................................................';
					botsendMessage(msg, Te);
				});
			});
		}
		if (msg.data.split(' ')[2] == 'Pita')
			conexion.recHit(estat[0].Valor, "insert into ImpresoraCola (id,impresora,descripcio,texte,tmstPeticio,TmStImpres,Estat) values (newid(),'produccio_" + msg.data.split(' ')[3] + "_Tot','" + String.fromCharCode(27, 29, 7) + "1" + "',getdate())").then(info => {
				botsendMessage(msg, "Peticio Enviada");
			});
		if (msg.data.split(' ')[2] == 'Pinta') {
			let PrinterNom = msg.data.split(' ')[3];
			bot.sendMessage(msg.from.id, 'Texte a Imprimir ?', opcionsUsusari(TipTep, true))
				.then(async msg => {
					const replyId = bot.onReplyToMessage(msg.chat.id, msg.message_id, msg => {
						bot.removeReplyListener(replyId);
						conexion.recHit(estat[0].Valor, "insert into ImpresoraCola (id,impresora,texte,tmstPeticio) values (newid(),'produccio_" + PrinterNom + "_Tot','" + msg.text + "/n/r ',getdate())").then(info => {
							botsendMessage(msg, "Peticio Enviada");
						});
					});
				});
		}
	}
}

function Enquesta(msg, estat, TipTep) {
	/*      botiga = rsCdA("param1")
			empleado = rsCdA("param2")
			entrada = CDate(rsCdA("param3"))
			salida = CDate(rsCdA("param4"))
			turno = rsCdA("param5")
			extra = rsCdA("param6")
			aprendiz = rsCdA("param7")
			coord = rsCdA("param8")
			email = rsCdA("param10")
	*/
	var Sql = '';

	console.log(estat[0].Valor);
	conexion.recHit(estat[0].Valor, "select Param10,idCodigo from CodigosDeAccion where tipocodigo='FICHAJE' and Param10 like 'Telegram_" + estat[0].CodiUser + "_%' ").then(info => {
		/*
				info.recordset.forEach(element => {
		console.log(info.recordset[i].Param10.split('_')[2]);
					bot.stopPoll(info.recordset[i].Param10.split('_')[2],info.recordset[i].Param10.split('_')[3]).then(Po => {	
						conexion.recHit(estat[0].Valor, "Update CodigosDeAccion Set tipocodigo='FICHAJE_OK' Where idCodigo = '"  + info.recordset[i].idCodigo + "' ")
						bot.deleteMessage(info.recordset[i].Param10.split('_')[2],info.recordset[i].Param10.split('_')[3]);
						bot.deleteMessage(info.recordset[i].Param10.split('_')[2],info.recordset[i].Param10.split('_')[3]+1);
					});
				});
			*/
		switch (TipTep) {
			case 'FRANQUICIA':
				Sql = "select codi from ConstantsClient where variable = 'userFranquicia' and valor = " + null + " ";
				break;
			default:
				Sql = "Select codi from constantsclient where variable = 'SupervisoraCodi' and valor = " + estat[0].CodiUser;
				break;
		}
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			var Botigues = '';
			for (var i = 0; i < info.rowsAffected; i++) {
				if (Botigues != '') Botigues += ',';
				Botigues += info.recordset[i].codi;
			}

			Sql = "select top 1 x.valor,d.nom NomDep,c.nom NomCli,t.horaInicio,t.horaFin,t.nombre,a.idCodigo idCodigo from ";
			Sql += "(select * from CodigosDeAccion where tipocodigo='FICHAJE' and datediff(hour,TmStmp,getdate()) < 100 ";
			if (Botigues != '') Sql += "and isnull(Param1,0) in(" + Botigues + ") ";
			Sql += " ) a ";
			Sql += "join Clients c on c.codi=isnull(a.Param1,0) ";
			Sql += "join Dependentes d on d.codi=isnull(a.param2,0) ";
			Sql += "left join cdpTurnos t on t.idturno = isnull(a.param5,0) ";
			Sql += "left join dependentesExtes x on x.id = isnull(a.Param2,0) and x.nom = 'TIPUSTREBALLADOR' ";
			Sql += "order by TmStmp desc  ";
			conexion.recHit(estat[0].Valor, Sql).then(info => {
				if (info.rowsAffected > 0) {
					var question = "" + info.recordset[0].NomDep + " Ha Treballat a " + info.recordset[0].NomCli + " De .....";
					var answers = ["Has fet 65 Minuts de mes", "Modifica el torn de 8:30 a 15:00", "Modifica el torn de 8:30 a 15:30", "Crea Un Torn Nou de 08:00 a 15:00"]; // Mínimo 2 y máximo 10 opciones 
					const opts = { 'is_anonymous': false, 'allows_multiple_answers': false }; //  'type': 'quiz', // Puede ser 'regular' o 'quiz'  'correct_option_id': 0
					bot.sendPoll(msg.from.id, question, answers, opts).then(Po => {
						conexion.recHit(estat[0].Valor, "Update  CodigosDeAccion set Param10='Telegram_" + estat[0].CodiUser + '_' + msg.from.id + '_' + Po.message_id + "' where idCodigo = '" + info.recordset[0].idCodigo + "'");
					});
					var keyboard = [];
					keyboard.push([{ 'text': '\u{1F64B} MES !', 'callback_data': 'Enquesta' }]);
					botsendMessage(msg, ".", {
						reply_markup: JSON.stringify({
							inline_keyboard: keyboard
						})
					});
				}
			});
		});
	});
}


function incidencies(msg, estat, TipTep) {
	var keyboard = [];
	if (msg.data === undefined || msg.data.split(' ')[1].length == 0) {
		conexion.recHit(estat[0].Valor, "Select * from SecreAvisos  Where tipus='Incidencies' and Lliure2 = '" + msg.from.id + "' And LLiure1 = '" + Token + "' ").then(info => {
			keyboard.push([{ text: 'Totes', 'callback_data': 'Incidencies Consulta' }]);
			if (info.rowsAffected > 0) {
				keyboard.push([{ text: '\u{2705} Avisam ', 'callback_data': 'Incidencies AvisNo' }]);
			} else {
				keyboard.push([{ text: '\u{274C} No m avisis ', 'callback_data': 'Incidencies AvisSi' }]);
			}
			keyboard.push([{ text: 'Crear Incidencia', 'callback_data': 'Incidencies Crea' }]);
			botsendMessage(msg, 'Incidencies', { reply_markup: JSON.stringify({ inline_keyboard: keyboard, hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true, }), });
		});
	}
	if (msg.data === undefined) return 0;

	if (msg.data.split(' ')[1] == 'AvisSi') {
		var Sql = "Delete SecreAvisos  ";
		Sql += "Where tipus='Incidencies' and LLiure2 = '" + msg.from.id + "' And LLiure1 = '" + Token + "' ";
		Sql += "Insert into ";
		Sql += "SecreAvisos (id,tipus,[timestamp],usuari,LLiure1,LLiure2,LLiure3,LLiure4,LLiure5)  ";
		Sql += "values  ";
		Sql += "(newid(),'Incidencies',getdate(),'" + estat[0].CodiUser + "','" + Token + "','" + msg.from.id + "','Totes','','')  ";
		Sql += "Insert into ";
		Sql += "SecreAvisos (id,tipus,[timestamp],usuari,LLiure1,LLiure2,LLiure3,LLiure4,LLiure5)  ";
		Sql += "values  ";
		Sql += "(newid(),'Impresoras',getdate(),'" + estat[0].CodiUser + "','" + Token + "','" + msg.from.id + "','LesMeves','','')  ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			botsendMessage(msg, 'Incidencies', {
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[{ text: 'Totes', 'callback_data': 'Incidencies Consulta' }],
						[{ text: '\u{2705} Avisam ', 'callback_data': 'Incidencies AvisNo' }],
						[{ text: 'Crear Incidencia', 'callback_data': 'Incidencies Crea' }]
					], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
				}),
			});
		});
	}
	if (msg.data.split(' ')[1] == 'AvisNo') {
		bot.deleteMessage(msg.from.id, msg.message.message_id);
		Sql = "Delete SecreAvisos  ";
		Sql += "Where tipus='Incidencies' and LLiure2 = '" + msg.from.id + "' And LLiure1 = '" + Token + "' ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			botsendMessage(msg, 'Incidencies', {
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[{ text: 'Totes', 'callback_data': 'Incidencies Consulta' }],
						[{ text: '\u{274C} No m avisis ', 'callback_data': 'Incidencies AvisSi' }],
						[{ text: 'Crear Incidencia', 'callback_data': 'Incidencies Crea' }]
					], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true,
				}),
			});
		});
	}

	if (msg.data.split(' ').length == 2 && msg.data.split(' ')[1] == 'Consulta') {
		conexion.recHit(estat[0].Valor, "select estado,count(*) i from incidencias  group by estado").then(info => {
			info.recordset.forEach(element => {
				keyboard.push([{ 'text': element.estado + " " + element.i + " ", 'callback_data': 'Incidencies Consulta ' + element.estado }]);
			});
			botsendMessage(msg, "Estat", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
		});
	}
	if (msg.data.split(' ').length == 3) {
		Sql = "Select d.nom Nom,d.codi codi , count(*) i from  ";
		Sql += "(select * from incidencias  where estado = '" + msg.data.split(' ')[2] + "' ) i  ";
		Sql += "join dependentes d on d.codi = i.usuario  ";
		Sql += "group by d.nom ,d.codi order by d.nom  ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			info.recordset.forEach(element => {
				keyboard.push([{ 'text': element.Nom + " " + " " + element.i + " ", 'callback_data': 'Incidencies Consulta ' + msg.data.split(' ')[2] + ' User ' + element.codi }]);
			});
			bot.deleteMessage(msg.from.id, msg.message.message_id);
			botsendMessage(msg, "Usuari ", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
		});
	}

	if (msg.data.split(' ').length == 5 && msg.data.split(' ')[3] == 'User') {  // Tenim User 
		Sql = "select top 10 c.nom Nom ,id,datediff(hour ,lastupdate,getdate()) d,incidencia  from ";
		Sql += "(select *  from incidencias  where usuario = '" + msg.data.split(' ')[4] + "' And estado = '" + msg.data.split(' ')[2] + "' ) i  ";
		Sql += "left join clients c on cast(c.codi as nvarchar) = i.Cliente  ";
		Sql += "order by timestamp desc  ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			info.recordset.forEach(element => {
				keyboard.push([{ 'text': element.Nom + " " + element.d + " " + element.incidencia + " ", 'callback_data': 'Incidencies Consulta ' + msg.data.split(' ')[2] + ' User ' + msg.data.split(' ')[4] + ' ' + element.id }]);
			});
			bot.deleteMessage(msg.from.id, msg.message.message_id);
			botsendMessage(msg, "Estat", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
		});
	}

	if (msg.data.split(' ').length == 6) { // Tenim Id
		Sql = "select cc.valor tel ,i.id id,c.nom NomClient ,d.nom NomResp,incidencia ,estado,d.nom NomTecnic ,lastupdate   from   ";
		Sql += "(select * from incidencias where id = '" + msg.data.split(' ')[5] + "') i  ";
		Sql += "left join clients c on cast(c.codi as nvarchar) = i.Cliente ";
		Sql += "join Dependentes d on d.codi = i.Usuario ";
		//		Sql+="join Dependentes t on t.codi = i.Tecnico  ";
		Sql += "left join constantsclient  cc on cc.codi = i.Cliente and cc.variable = 'Tel' ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			info.recordset.forEach(element => {
				var Te = "";
				Te += 'Incidencia : ' + element.id;
				Te += '\nNomClient : ' + element.NomClient;
				Te += '\nTelefon : ' + element.tel;
				Te += '\nNomResp : ' + element.NomResp;
				Te += '\nincidencia : ' + element.incidencia;
				Te += '\nestado : ' + element.estado;
				Te += '\nNomTecnic : ' + element.NomTecnic;
				Te += '\nlastupdate : ' + element.lastupdate;
				keyboard.push([{ 'text': 'Resolta', 'callback_data': 'Incidencies Resolta ' + element.id }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id);
				botsendMessage(msg, Te, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
			});
		});
	}

	if (msg.data.split(' ')[1] == 'Resolta') { // Tenim Id
		conexion.recHit(estat[0].Valor, "Update Incidencias set estado ='Resuelta' Where Id = " + msg.data.split(' ')[2] + " ").then(info => {
			conexion.recHit('Fac_Hitrs', "update Incidencias set estado = 'Resuelta' where Id = (select Id from Inc_Link_Otros where idOtro = " + msg.data.split(' ')[2] + ")").then(info => {
				conexion.recHit(estat[0].Valor, "select estado,count(*) i from incidencias  group by estado").then(info => {
					info.recordset.forEach(element => {
						keyboard.push([{ 'text': element.estado + " " + element.i + " ", 'callback_data': 'Incidencies Consulta ' + element.estado }]);
					});
					bot.deleteMessage(msg.from.id, msg.message.message_id);
					botsendMessage(msg, "Estat", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				});
			});
		});
	}
}


function Fichar(msg, estat, TipUsu) {
	var d = new Date();
	var keyboard = [];

	if (msg.data === undefined || msg.data.split(' ')[1].length == 0) {
		keyboard.push([{ 'text': '\u{1F64B}' + ' Qui esta Treballant ? \u{1F481}', 'callback_data': 'Fichar Qui' }]);
		keyboard.push([{ 'text': '\u{1FA91}' + ' Fichar', 'callback_data': 'Fichar Ficha' }]);
		keyboard.push([{ 'text': '\u{1FA91}' + ' Resum', 'callback_data': 'Fichar Resum Mes' }]);
		keyboard.push([{ 'text': '\u{1FA91}' + ' Fichas Personal', 'callback_data': 'Fichar Edit' }]);
		//keyboard.push([{'text': '\u{1FA91}' + ' Pruebas' , 'callback_data': 'Fichar Pruebas'}]);
		botsendMessage(msg, 'Fichar : ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
	} else {
		switch (msg.data.split(' ')[1]) {
			case 'Pruebas':
				let off = parseInt(msg.data.split('#')[2]);
				let CliNom = msg.data.split('#')[3]
				let CliCodi = msg.data.split('#')[4]
				let p = 0;
				console.log(p)
				

				let today = new Date(new Date().getTime() + (86400000 * parseInt(msg.data.split('#')[2])))
				Sql= "select c.nom from paramshw w join clients c on c.codi = w.codi"
				Sql += " order by c.nom  OFFSET " + (10 * p) + " ROWS FETCH NEXT 10 ROWS ONLY "
				//botsendMessage(msg,Sql)
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					console.log(info)
					//keyboard.push([{ 'text': '<<<<', 'callback_data': 'Comandes #TriClient#' + off + '#SiBorra' }]);
					info.recordset.forEach(element => {
						keyboard.push([{ 'text':  element.nom, 'callback_data': 1}])
					})
					let p1 = p - 1
					if (p1 < 0) p1 = 0
					let p2 = p + 1
					if (keyboard.length < 10) p2 = p - 1
					keyboard.push([{ 'text': '<<< ' + p1 + '0', 'callback_data': p1 },
					{ 'text': p2 + '0' + ' >>>', 'callback_data':  p2 }]);
				bot.deleteMessage(msg.from.id, msg.message.message_id)
					console.log(keyboard)
					console.log(`Esto es lo que tiene la p ${p}`)
					console.log(Sql);
					botsendMessage(msg, "En que tienda estas", { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
				});
	
				break;
			case 'Ficha':
				let id = msg.from.id;
				var Sql = `select Usuario from secretaria where Aux1 = '${id}'`;
				conexion.recHit('Hit', Sql).then(info1 => {
					var tlf = info1.recordset[0].Usuario.substring(2);
					let accio = `select top 1 accio from cdpDadesFichador where usuari = (select id from dependentesextes where nom = 'TLF_MOBIL' and valor = '${tlf}') order by tmst desc`
					conexion.recHit(estat[0].Valor, accio).then((data) => {
						let nuevaAccion = 1
						nuevaAccion = (data.recordset[0].accio == 1) ? 2 : 1;
						let fichar = `insert into cdpDadesFichador values (0, getdate(), ${nuevaAccion}, (select id from dependentesextes where nom = 'TLF_MOBIL' and valor = '${tlf}'), newid(), null, null, NULL , '[Desde: TELEGRAM]')`
						conexion.recHit(estat[0].Valor, fichar).then(() => {
							let frase = ["Benvingut ", "Descansa "];
							botsendMessage(msg, frase[nuevaAccion - 1] + msg.from.first_name);
						});
					});
				});
				break;
			case 'Qui':
				switch (TipUsu) {
					case 'FRANQUICIA':
						Sql = "select codi from ConstantsClient where variable = 'userFranquicia' and valor = " + null + " ";
						break;
					default:
						Sql = "Select codi from constantsclient where variable = 'SupervisoraCodi' and valor = " + estat[0].CodiUser;
						break;
				}
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					var Botigues = '';
					for (var i = 0; i < info.rowsAffected; i++) {
						if (Botigues != '') Botigues += ',';
						Botigues += info.recordset[i].codi;
					}
					Sql = "select d.nom NomDep,isnull(c.nom,'Casa') NomLloc,accio ,tmst,editor from ";
					Sql += '(select * from cdpDadesFichador where datediff(DAY,tmst,getdate()) <3 '
					if (Botigues != '') Sql += "and isnull(lloc,1) in(" + Botigues + ") ";
					Sql += ') f ';
					Sql += 'join dependentes d on d.codi=f.usuari ';
					Sql += 'Left join clients  c on c.codi = f.lloc  ';
					Sql += 'order by tmst ';
					//botsendMessage(msg,Sql)					
					conexion.recHit(estat[0].Valor, Sql).then(info => {
						var Te = '';
						console.log(info.recordset[23]);
						for (var i = 0; i < info.rowsAffected; i++) {

							d = info.recordset[i].tmst;
							d.setHours(d.getHours() - 1);
							Te += arrayDias[d.getUTCDay()] + ' ' + dateFormat(d, "dd ")
							if (info.recordset[i].accio == 1) Te += '\u{1F477}';
							else Te += '\u{1F44B}';	 //Te+='\u{1F4A4}';

							Te += ' ' + (info.recordset[i].NomDep + '           ').substring(0, 10) + '';
							Te += ',' + ' ' + arrayHores[d.getHours() - 1] + ' *' + dateFormat(d, "HH:MM") + '*';
							if (info.recordset[i].editor == 'No es la persona que dice ser') Te += ' \u{1f925} ';
							if (info.recordset[i].editor == 'Si es la persona que dice ser') Te += ' \u{1F44C} '; //U+1F510
							if (info.recordset[i].editor == 'No tiene la voz registrada') Te += ' \u{1F937} '; //U+1F510							

							if (info.recordset[i].NomLloc == 'Casa' || info.recordset[i].NomLloc == '') Te += ' \u{1F3E0} ';
							else Te += ' ' + info.recordset[i].NomLloc + ' ';
							Te += '\n';
						}
						if (Te == '') Te = 'Cap fixatge en els ultims tres dies.';
						botsendMessage(msg, Te, { 'parse_mode': 'Markdown' });
					});
				});

				break;
			case 'Resum':
				switch (msg.data.split(' ')[2]) {
					case 'Mes':
						const spanish = new Intl.DateTimeFormat('en-US', { month: 'long' });

						var d = new Date();
						keyboard.push([{ 'text': spanish.format(d), 'callback_data': 'Fichar Resum Treballador 0' }]);
						d = new Date(d.setMonth(d.getMonth() - 1));
						keyboard.push([{ 'text': spanish.format(d), 'callback_data': 'Fichar Resum Treballador 1' }]);
						d = new Date(d.setMonth(d.getMonth() - 1));
						keyboard.push([{ 'text': spanish.format(d), 'callback_data': 'Fichar Resum Treballador 2' }]);
						d = new Date(d.setMonth(d.getMonth() - 1));
						keyboard.push([{ 'text': spanish.format(d), 'callback_data': 'Fichar Resum Treballador 3' }]);
						d = new Date(d.setMonth(d.getMonth() - 1));
						keyboard.push([{ 'text': spanish.format(d), 'callback_data': 'Fichar Resum Treballador 4' }]);
						botsendMessage(msg, 'Fichar : ', { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
						break;
					case 'Treballador':
						var Mes = msg.data.split(' ')[3];
						var d = new Date();
						d = new Date(d.setMonth(d.getMonth() - Mes));
						conexion.recHit(estat[0].Valor, "select nom,codi from dependentes where codi in (select distinct usuari from cdpDadesFichador where month(tmst) = " + (d.getMonth() + 1) + " and year(tmst)=" + d.getFullYear() + ") order by nom").then(info => {
							info.recordset.forEach(element => {
								keyboard.push([{ 'text': element.nom, 'callback_data': 'Fichar Resum Pdf ' + Mes + ' ' + + element.codi + ' ' + element.nom }]);
							});
							var Tit = 'Persones';
							if (keyboard.length == 0) Tit = 'Cap Fitchatge en tot el mes....';
							botsendMessage(msg, Tit, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
						})
						break;

					case 'Pdf':
						Mes = msg.data.split(' ')[3];
						var Treb = msg.data.split(' ')[4];
						var Nom = msg.data.split(' ')[5];
						var d = new Date();
						d = new Date(d.setMonth(d.getMonth() - Mes));
						let id = msg.from.id;
						Sql = `select Usuario from secretaria where Aux1 = '${id}'`;
						conexion.recHit('Hit', Sql).then(info1 => {
							var tlf = info1.recordset[0].Usuario.substring(2);
							var correo;
							var Sqlcorreo = `Select valor  from dependentesExtes where id =${Treb} and nom ='EMAIL' `
							conexion.recHit(estat[0].Valor, Sqlcorreo).then((data) => {
								if (data.recordset[0].valor == null || data.recordset[0].valor == "") {
									bot.sendMessage(msg.from.id, `No tengo nigun correo asociado a ${Nom} me lo puedes introducir:`, opcionsUsusari(null, true))
										.then(async msg1 => {
											const replyId2 = bot.onReplyToMessage(msg1.chat.id, msg1.message_id, msg2 => {
												bot.removeReplyListener(replyId2);
												var insertCorreo = `update dependentesExtes set valor = '${msg2.text}' where id =${Treb} and nom ='EMAIL' `
												conexion.recHit(estat[0].Valor, insertCorreo).then((data) => {
													botsendMessage(msg, "Correo Actualizado.");
													correo = msg2.text;
													enviarResumenhoras(msg, correo, estat[0].Valor)
												});
											})
										})

								} else {
									correo = data.recordset[0].valor;
									enviarResumenhoras(msg, correo, estat[0].Valor)
								}
							});
						});
						break;
				}
				break;
			case 'Edit':
				// if(msg.data.split(' ').length == 2){
				// 	bot.sendMessage(msg.from.id, 'Nom del Treballador ?', opcionsUsusari(TipTep,true))  
				// 		.then(async msg => {
				// 			const replyId = bot.onReplyToMessage(msg.chat.id,msg.message_id, msg => {
				// 				bot.removeReplyListener(replyId);
				// 				conexion.recHit(estat[0].Valor, "Select nom,codi from dependentes where nom like '%" + msg.text + "%' order by nom").then(info => {
				// 					info.recordset.forEach(element => {
				// 						keyboard.push([{'text': element.nom , 'callback_data': 'Fichar Edit ' + element.codi}]);
				// 					});
				// 					botsendMessage(msg, "Persones...." , {reply_markup: JSON.stringify({ inline_keyboard: keyboard})});
				// 				})
				// 			})
				// 		})
				// }else{
				// 	if(msg.data.split(' ').length == 3){
				// 		var usu = msg.data.split(' ')[2];
				// 		if( usu == 'Propia' ) usu = estat[0].CodiUser;
				// 		enviaFichaTreballador(msg,estat,usu);
				// 	}else{
				// 		bot.sendMessage(msg.from.id, 'Entra El ' + msg.data.split(' ')[3], opcionsUsusari(TipTep,true))
				// 			.then(async msg1 => {
				// 			const replyId2 = bot.onReplyToMessage(msg1.chat.id,msg1.message_id, msg2 => {
				// 				bot.removeReplyListener(replyId2);
				// 				switch (msg.data.split(' ')[3]) {
				// 					case 'Nom' : Sql="Update Dependentes Set Memo = '" + msg2.text + "' where codi = " + msg.data.split(' ')[2]; 
				// 						break;
				// 					default  : Sql="Delete dependentesextes where  nom = '" + msg.data.split(' ')[3] + "' and id = " + msg.data.split(' ')[2] + " insert into dependentesextes(Id,Nom,Valor) values (" + msg.data.split(' ')[2] + ",'" + msg.data.split(' ')[3] + "','" + msg2.text + "')"; 
				// 					break;
				// 				}	
				// 				conexion.recHit(estat[0].Valor,Sql).then(info => {
				// 					enviaFichaTreballador(msg,estat,msg.data.split(' ')[2] );
				// 				})
				// 			})
				// 		})	
				// 	}	
				// }
				break;
			default:
				console.log(msg.data.split(' ')[1]);
		}
	};
}
function enviarResumenhoras(msg, correo, empresa) {
	var sendResumen = `insert into feinesafer (id, tipus, ciclica, Param1, Param2, Param3, tmstmp) values (newid(), 'SecreInformeResumenHoras', 0, 'resumen horas', '${correo}', '${empresa}', getdate())`;
	conexion.recHit(empresa, sendResumen).then((data) => {
		botsendMessage(msg, "Enviando Correo...");
	});
}
function enviaFichaTreballador(msg, estat, Codi) {
	var keyboard = [];
	var Sql = '';
	Sql = "Select d.codi codi,d.nom nom,d.memo memo,e1.valor Dni,e2.valor Tipus,e3.valor cc ,e4.valor DataNaix, e5.valor email , e6.valor Telefon ";
	Sql += "from dependentes d  ";
	Sql += "left join dependentesextes e1 on e1.id = d.codi and e1.nom ='DNI' ";
	Sql += "left join dependentesextes e2 on e2.id = d.codi and e2.nom ='TIPUSTREBALLADOR' ";
	Sql += "left join dependentesextes e3 on e3.id = d.codi and e3.nom ='CC' ";
	Sql += "left join dependentesextes e4 on e4.id = d.codi and e4.nom ='DATA_NAIXEMENT' ";
	Sql += "left join dependentesextes e5 on e5.id = d.codi and e5.nom ='EMAIL' ";
	Sql += "left join dependentesextes e6 on e6.id = d.codi and e6.nom ='TLF_MOBIL' ";
	Sql += "where codi = " + Codi + " ";
	conexion.recHit(estat[0].Valor, Sql).then(info => {
		var Nom = "";
		info.recordset.forEach(element => {
			Nom = element.nom;
			keyboard.push([{ 'text': 'Nom : ' + element.memo, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' Nom' }]);
			keyboard.push([{ 'text': 'Dni : ' + element.Dni, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' DNI' }]);
			keyboard.push([{ 'text': 'Telefon : ' + element.Telefon, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' TLF_MOBIL' }]);
			keyboard.push([{ 'text': 'Tipus : ' + element.Tipus, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' TIPUSTREBALLADOR' }]);
			keyboard.push([{ 'text': 'cc : ' + element.cc, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' CC' }]);
			keyboard.push([{ 'text': 'DataNaix : ' + element.DataNaix, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' DATA_NAIXEMENT' }]);
			keyboard.push([{ 'text': 'email : ' + element.email, 'callback_data': 'Fichar Edit ' + msg.data.split(' ')[2] + ' EMAIL' }]);
		});
		if (Nom != '') botsendMessage(msg, Nom, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
	});
}

function logaSu(msg, estat) {
	var keyboard = [];
	if (nombresDeDios.indexOf(msg.from.id) == -1 && msg.data == undefined) msg.data = 'Su ' + estat[0].Valor

	if (msg.data === undefined || msg.data.split(' ')[1].length == 0) {
		conexion.recHit(estat[0].Valor, "select distinct empresa nom from hit.dbo.Secretaria  where not isnull(Aux1,'') ='' order by empresa").then(info => {
			for (var i = 0; i < info.rowsAffected; i++)
				keyboard.push([{ 'text': '\u{1F64B}' + ' Loga  ' + info.recordset[i].nom + '\u{1F481}', 'callback_data': 'Su ' + info.recordset[i].nom }]);
			botsendMessage(msg, "Tria Empresa", {
				reply_markup: JSON.stringify({
					inline_keyboard: keyboard
				})
			});
		});
	} else {
		if (msg.data.split(' ').length == 2) {
			var Sql = "select d.nom,e.valor,s.Usuario codi from hit.dbo.Secretaria s join ( "
			Sql += "select id as codi ,valor  collate Modern_Spanish_CI_AS as telefon from dependentesExtes where nom='TLF_MOBIL'  "
			Sql += "union "
			Sql += "select codi,telefon  collate Modern_Spanish_CI_AS  from dependentes ) t on  "
			Sql += "cast(t.telefon as nvarchar) collate Modern_Spanish_CI_AS  =s.Usuario "
			Sql += "or '34' + cast(t.telefon as nvarchar) collate Modern_Spanish_CI_AS  =s.Usuario "
			Sql += "or cast(t.telefon as nvarchar) collate Modern_Spanish_CI_AS = '34' + s.Usuario "
			Sql += "join dependentes d on d.codi=t.codi  "
			Sql += "join dependentesExtes e on e.id =t.codi  and e.nom = 'TIPUSTREBALLADOR' "
			Sql += "Where s.Empresa='" + msg.data.split(' ')[1] + "' order by d.nom "
			//			botsendMessage(msg,Sql)
			conexion.recHit(msg.data.split(' ')[1], Sql).then(info => {
				for (var i = 0; i < info.rowsAffected; i++)
					keyboard.push([{ 'text': '\u{1F64B}' + ' Loga  ' + info.recordset[i].nom + ' ' + info.recordset[i].valor + '\u{1F481}', 'callback_data': 'Su ' + msg.data.split(' ')[1] + ' ' + info.recordset[i].codi }]);
				botsendMessage(msg, "Tria Usuari", {
					reply_markup: JSON.stringify({
						inline_keyboard: keyboard
					})
				});
			});
		} else {
			conexion.recHit(estat[0].Valor, "update hit.dbo.Secretaria set empresa = '" + msg.data.split(' ')[1] + "' , usuario = '" + msg.data.split(' ')[2] + "' where aux1='" + msg.from.id + "' ").then(info => {
				botsendMessage(msg, "Logat a : " + msg.data.split(' ')[1]);
				CreaTaules(estat[0].Valor);
			});
		}
	}
}

function getKilometros(lat1, lon1, lat2, lon2) {
	var rad = function (x) { return x * Math.PI / 180; }
	var R = 6378.137; //Radio de la tierra en km
	var dLat = rad(lat2 - lat1);
	var dLong = rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d.toFixed(3); //Retorna tres decimales
}

function carregaBotiga(codi) {
	var Botig = [];
	switch (codi) {
		case 58:
			Botig.push(
				{
					'Nom': 'Forrellat',
					'codi': codi,
					'latitude': '41.56173008199911',
					'longitude': '2.0985739618410104'
				});
			break;
		case 415:
			Botig.push(
				{
					'Nom': 'T--115',
					'codi': codi,
					'latitude': '41.375578',
					'longitude': '2.1410033'
				});
			break;
		case 1:
			Botig.push(
				{
					'Nom': 'Major',
					'codi': codi,
					'latitude': '41.559794',
					'longitude': '2.0981033'
				});
			break;
		case 117:
			Botig.push(
				{
					'Nom': 'Tenda 0',
					'codi': codi,
					'latitude': '41.559794',
					'longitude': '2.0981033'
				});
			break;
	}
	return Botig;
}

function seleccionaBotiga(lat, lon) {

	switch (BotName) {
		case 'PaNatural':
			return carregaBotiga(58);
			break;
		case '365Cafe':
			return carregaBotiga(415);
			break;
		case 'Armengol':
			return carregaBotiga(1);
			break;
		case 'Carne':
			return carregaBotiga(117);
			break;
		default:
			return carregaBotiga(117);
			break;
	}
	return carregaBotiga(58);
}


function botsendMessage(msg, t, o = null) {
	if (o === null || o == '') o = opcionsUsusari(null);
	if (!(t.length > 0)) t = 'Soy un bot.'
	try {
		bot.sendMessage(msg.from.id, t, o);
	}
	catch (err) {
		console.log(err);
	}
}

async function comandero(msg, estat) {
	var keyboard = [];
	var today = new Date();
	var Sql = '', Incr = '';
	if (msg.data === undefined || msg.data.split(' ').length == 2) {
		//if(TipTep=='GERENT') {
		//			Sql+='select top 1 c.codi codi,nom from ' + nomTaulaVenut(new Date()) + ' v join  clients C on c.codi=v.Botiga  order by v.data desc  ';
		//		}else{
		//			Sql='IF (select top 1 lloc from cdpDadesFichador  where usuari = ' + estat[0].CodiUser + ' and lloc in (select cast(codi as nvarchar) from ParamsHw) order by tmst desc) IS NULL ';
		//			Sql+='BEGIN  ';
		//			Sql+='select top 1 c.codi codi,nom from ' + nomTaulaVenut(new Date()) + ' v join  clients C on c.codi=v.Botiga  order by v.data desc  ';
		//			Sql+='END else ';
		//			Sql+='select c.codi codi,c.nom nom from clients c join ( ';
		//			Sql+='select top 1 lloc codi from cdpDadesFichador  where usuari = ' + estat[0].CodiUser + ' and lloc in (select cast(codi as nvarchar) from ParamsHw) order by tmst desc) f ';
		//			Sql+='on f.codi =c.codi ';
		Sql += 'Select c.codi codi,c.nom nom from clients c join ( ';
		Sql += 'Select top 1 lloc codi from cdpDadesFichador  where datediff(hour,tmst,getdate())  < 8 and usuari = ' + estat[0].CodiUser + ' and lloc in (select cast(codi as nvarchar) from ParamsHw) order by tmst desc) f ';
		Sql += 'on f.codi =c.codi ';
		//		}

		conexion.recHit(estat[0].Valor, Sql).then(info => {
			if (info.rowsAffected > 0) {
				var Botiga = info.recordset[0].codi;
				var BotigaNom = info.recordset[0].nom;
				keyboard.push([{ 'text': '\u{1F64B}' + ' Tria Taula \u{1F481}', 'callback_data': 'comandero Botiga_' + Botiga }]);
				Sql = "DECLARE @taules INT; "
				Sql += "SELECT @taules = count(*) from ParamsTpv where codiclient  = 288 and variable like 'TaulaNom%'  "
				Sql += "IF @taules > 1 "
				Sql += "BEGIN "
				Sql += "select substring(variable,9,3),valor from ParamsTpv where codiclient  = 288 and variable like 'TaulaNom%' order by valor  "
				Sql += "END "
				Sql += "ELSE "
				Sql += "BEGIN "
				Sql += "SELECT * FROM (VALUES  "
				Sql += "(1,'Taula 1'), "
				Sql += "(2,'Taula 2'), "
				Sql += "(3,'Taula 3'), "
				Sql += "(4,'Taula 4'), "
				Sql += "(5,'Taula 5') "
				Sql += ") AS t(variable,valor)  order by valor "
				Sql += "END "
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					info.recordset.forEach(element => {
						keyboard.push([{ 'text': '\u{1FA91}' + element.valor, 'callback_data': 'comandero Taula ' + element.variable }]);
					})
					if (msg.message === undefined) { bot.deleteMessage(msg.from.id, msg.message_id); } else { bot.deleteMessage(msg.from.id, msg.message.message_id); }
					botsendMessage(msg, 'Comandero Botiga : ' + BotigaNom, { reply_markup: JSON.stringify({ inline_keyboard: keyboard }) })
				})
			} else {
				botsendMessage(msg, 'No estas traballant Cap Botiga !! ');
			}
		})
	} else {
		switch (msg.data.split(' ')[1]) {
			case 'Taula':
				console.log(msg.data)
				keyboard.push([{ 'text': '\u{1F64B}' + ' Tria Taula \u{1F481}', 'callback_data': 'comandero Botiga_' + extreuBotiga(msg) }]);
				keyboard.push([{ 'text': '\u{1FA91}' + ' Detall Taula ' + msg.data.substring(14, 100), 'callback_data': 'comandero Detall Taula_' + msg.data.substring(16, 100) }
					, { 'text': '\u{1FA91}' + ' Imprimeix \u{1F5D2} ', 'callback_data': 'comandero Imprimeix Taula_' + msg.data.substring(16, 100) }]);
				Sql = "Select valor from ParamsTpv where codiclient  = " + extreuBotiga(msg) + " and variable like 'DosNivells_%_Tag' and not isnull(valor,'') = '' Order by Valor "
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					var linea = [];
					for (var i = 0; i < info.rowsAffected; i++) {
						keyboard.push([{ 'text': info.recordset[i].valor, 'callback_data': 'comandero Grup ' + info.recordset[i].valor }]);
					}
					if (i == 0) {  // Un nivell de teclats
						msg.data = 'comandero Grup'
						return;
					} else {
						bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => { botsendMessage(msg, msg.message.text, { resize_keyboard: false, one_time_keyboard: false, selective: false, reply_markup: JSON.stringify({ inline_keyboard: keyboard }) }); });
					}
				});
				break;
			case 'Grup':
				var Grup = msg.data.split(' ')[2]
				keyboard.push(msg.message.reply_markup.inline_keyboard[0])
				keyboard.push(msg.message.reply_markup.inline_keyboard[1])
				keyboard.push([{ 'text': '\u{1F64B}' + Grup + ' \u{1F481}', 'callback_data': 'comandero Taula' }])

				Sql = "select distinct ambient from teclatstpv where data in( "
				Sql += "select max(data) from TeclatsTpv where llicencia = " + extreuBotiga(msg) + " "
				Sql += ") and llicencia = " + extreuBotiga(msg) + " ";
				Sql += "and Ambient like '" + Grup + "%' "
				Sql += "order by ambient "

				conexion.recHit(estat[0].Valor, Sql).then(info => {
					var linea = [];
					for (var i = 0; i < info.rowsAffected; i++) {
						linea.push({ 'text': info.recordset[i].ambient, 'callback_data': 'comandero Teclat ' + info.recordset[i].ambient });
						if (((i + 1) % 3) == 0) { keyboard.push(linea); linea = []; }
					}
					if (linea != []) { keyboard.push(linea); linea = []; }
					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
						botsendMessage(msg, msg.message.text, { resize_keyboard: false, one_time_keyboard: false, selective: false, reply_markup: JSON.stringify({ inline_keyboard: keyboard }) });
					});
				});
				var sql = "";
				sql += "Delete TicketsTemporalsAccions where datediff(hour,tmst,getdate()) > 10 ";
				sql += "Delete TicketsTemporals where datediff(hour,tmst,getdate()) > 10 ";
				sql += "insert into MissatgesPerLlicencia  ([Id],[TimeStamp],[QuiStamp],[DataEnviat],[DataRebut],[Desti],[Origen],[Accio],[Param1],[Param2],[Param3],[Param4],[Texte]) ";
				sql += "values  ";
				sql += "(newid(),getdate(),'" + estat[0].Auxiliar1 + "',getdate(),Null," + extreuBotiga(msg) + ",'" + estat[0].Auxiliar1 + "','ConfiguraConexio','Tickets','" + extreuBotiga(msg) + "','','','') ";
				conexion.recHit(estat[0].Valor, sql);
				break;
			case 'Teclat':
				keyboard.push(msg.message.reply_markup.inline_keyboard[0])
				keyboard.push(msg.message.reply_markup.inline_keyboard[1])
				keyboard.push(msg.message.reply_markup.inline_keyboard[2])
				keyboard.push([{ 'text': msg.data.substring(17, 100), 'callback_data': 'comandero Taula ' + extreuTaula(msg) }]);
				var today = new Date();
				Sql = "select nom,codi from ( "
				Sql += "select distinct article from teclatstpv where data in( "
				Sql += "select max(data) from TeclatsTpv where llicencia = " + extreuBotiga(msg) + " "
				Sql += ") and llicencia = " + extreuBotiga(msg) + " and ambient = '" + msg.data.substring(17, 100) + "' ";
				Sql += " ) t join articles a on a.codi=t.article order by nom ";
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					var linea = [];
					for (var i = 0; i < info.rowsAffected; i++) {
						linea.push({ 'text': info.recordset[i].nom, 'callback_data': 'comandero Article ' + info.recordset[i].codi });
						if (((i + 1) % 3) == 0) { keyboard.push(linea); linea = []; }
					}
					if (linea != []) { keyboard.push(linea); linea = []; }

					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
						botsendMessage(msg, msg.message.text, {
							reply_markup: JSON.stringify({
								inline_keyboard: keyboard
							})
						});
					});
				});
				break;
			case 'AtributsYa':
				var atributs = '';
				msg.message.reply_markup.inline_keyboard.forEach(element => {
					if (element[0].text.indexOf('\u{2705} ') == 0) atributs += element[0].callback_data.split(' ')[2] + ',';
				});

				conexion.recHit(estat[0].Valor, "Update TicketsTemporals Set rebut = '' ,Comentari = '" + atributs + "' Where Id = '" + msg.message.reply_markup.inline_keyboard[3][0].callback_data.split(' ')[2] + "'").then(x => {
					msg.data = 'comandero Teclat ' + msg.message.reply_markup.inline_keyboard[2][0].text;
					comandero(msg, estat);
				});
				break;
			case 'AtributsTogle':
				msg.message.reply_markup.inline_keyboard.forEach(element => {
					if (element[0].callback_data == msg.data) {
						estat = '\u{2705} ';
						if (element[0].text.substring(0, 2) == estat) estat = '\u{274C} ';
						element[0].text = estat + element[0].text.substring(2, 100);
					}
				});

				bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
					bot.sendMessage(msg.from.id, msg.message.text, {
						reply_markup: JSON.stringify({
							inline_keyboard: msg.message.reply_markup.inline_keyboard
						})
					}).then(x2 => {
						//								bot.editMessageText(msg.id, msg.message.message_id,  'Hola') 
					});
				});

				break;
			case 'Article':
				var codiArticle = msg.data.substring(18, 100);
				var Dependenta = -extreuTaula(msg);
				var Botiga = extreuBotiga(msg);
				var Cd = codiArticle;
				var Preu = 1;
				var IdSincro = 1;
				var Servit = 1;

				Sql = "insert into TicketsTemporals ";
				Sql += "(id,rebut,tmst,Botiga,Dependenta,Quantitat,Cd,Preu,Comentari,IdSincro,Servit) ";
				Sql += " select  ";
				Sql += "Newid() id,'' rebut ,GETDATE() tmst," + Botiga + " botiga," + Dependenta + "," + 1 + "," + codiArticle + ",-1,'',newid() ,'" + Servit + "' ";

				Sql = "DECLARE @Id nvarchar(200); SET @Id = Newid();";
				Sql += "insert into TicketsTemporals ";
				Sql += "(id,rebut,tmst,Botiga,Dependenta,Quantitat,Cd,Preu,Comentari,IdSincro,Servit)   ";
				Sql += "select  @Id id,'' rebut ,GETDATE() tmst," + Botiga + " botiga," + Dependenta + "," + 1 + "," + codiArticle + ",-1,'',newid() ,'" + Servit + "' ";
				Sql += "select @Id Id ";
				conexion.recHit(estat[0].Valor, Sql).then(x => {
					var IdNou = 'comandero AtributsYa ' + x.recordset[0].Id
					Sql = "Select a.codi codi,a.nom nom, aa.nom  nomPrincipal from articles a ";
					Sql += "join (Select CodiArticle from articlespropietats  where variable = 'ES_SUPLEMENT' and  valor='" + codiArticle + "') s on s.CodiArticle= a.codi ";
					Sql += "left join articles aa on aa.Codi = " + codiArticle + " order by a.nom ";
					conexion.recHit(estat[0].Valor, Sql).then(x => {
						keyboard = msg.message.reply_markup.inline_keyboard;
						keyboard = [];
						var niUn = true;
						keyboard.push(msg.message.reply_markup.inline_keyboard[0])
						keyboard.push(msg.message.reply_markup.inline_keyboard[1])
						keyboard.push(msg.message.reply_markup.inline_keyboard[2])
						x.recordset.forEach(element => {
							if (niUn) keyboard.push([{ 'text': 'Atributs de : ' + element.nomPrincipal + ' ', 'callback_data': IdNou }]);
							niUn = false;
							keyboard.push([{ 'text': '\u{274C} ' + element.nom, 'callback_data': 'comandero AtributsTogle ' + element.codi + ' ' + codiArticle + ' ' + extreuBotiga(msg) + ' ' + extreuTaula(msg) }]);
						});
						keyboard.push([{ 'text': 'Ya.', 'callback_data': IdNou }]);
						if (niUn) keyboard = msg.message.reply_markup.inline_keyboard;

						Sql += "";
						Sql += "select dependenta t , nom ,sum(quantitat) q ,sum(tt.preu) p ";
						Sql += "from TicketsTemporals tt  ";
						Sql += "join articles a on a.Codi=tt.Cd ";
						Sql += "where botiga = " + Botiga + " and dependenta = " + Dependenta + " ";
						Sql += "group by dependenta,nom ";

						conexion.recHit(estat[0].Valor, Sql).then(info => {
							let mis = "Articles \n";
							for (var i = 0; i < info.rowsAffected; i++) {
								mis += info.recordset[i].q + ' ' + info.recordset[i].nom + ' ' + '\n';
							}
							bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
								bot.sendMessage(msg.from.id, mis, {
									reply_markup: JSON.stringify({
										inline_keyboard: keyboard
									})
								}).then(x2 => {

									//								bot.editMessageText(msg.id, msg.message.message_id,  'Hola') 
								});
							});
						});
					});
				});
				break;
			case 'Detall':
				Dependenta = -extreuTaula(msg);
				Botiga = extreuBotiga(msg);

				keyboard.push([{ 'text': '\u{1F64B}' + ' Tria Taula \u{1F481}', 'callback_data': 'comandero Botiga_' + extreuBotiga(msg) }]);
				keyboard.push([{ 'text': '\u{1FA91}' + ' Detall Taula ' + extreuTaula(msg), 'callback_data': 'comandero Detall Taula_' + extreuTaula(msg) }
					, { 'text': '\u{1FA91}' + ' Imprimeix \u{1F5D2} ', 'callback_data': 'comandero Imprimeix Taula_' + extreuTaula(msg) }]);
				keyboard.push([{ 'text': '\u{1F64B}' + ' Afegir  Article \u{1F481}', 'callback_data': 'comandero Taula ' + extreuTaula(msg) }]);
				Sql += "select a.codi codi, nom ,sum(quantitat) q ,sum(tt.preu) p ";
				Sql += "from TicketsTemporals tt  ";
				Sql += "join articles a on a.Codi=tt.Cd ";
				Sql += "where botiga = " + Botiga + " and dependenta = " + Dependenta + " ";
				Sql += "group by dependenta,nom,a.codi ";
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					let mis = "Articles \n";
					for (var i = 0; i < info.rowsAffected; i++) {
						keyboard.push([
							{ 'text': '' + ' + ', 'callback_data': 'comandero ArticleMes ' + info.recordset[i].codi },
							{ 'text': info.recordset[i].q + ' ' + info.recordset[i].nom, 'callback_data': 'comandero Atributs Edit ' + info.recordset[i].codi + ' ' + extreuBotiga(msg) + ' ' + extreuTaula(msg) },
							{ 'text': '' + ' - ', 'callback_data': 'comandero ArticleMenos ' + info.recordset[i].codi }
						]);
					}
					bot.deleteMessage(msg.from.id, msg.message.message_id).then(x => {
						botsendMessage(msg, "Botiga " + Botiga, {
							resize_keyboard: false,
							one_time_keyboard: false,
							selective: false,
							reply_markup: JSON.stringify({
								inline_keyboard: keyboard
							})
						});
					});
				});
				break;
			case 'Atributs':
				console.log(msg.data.split(' ')[2]);
				console.log(msg.data.split(' ')[3]);
				console.log(msg.data.split(' ')[4]);
				console.log(msg.data.split(' ')[5]);
				break;
			case 'ArticleMes':
				Incr = ' + 1';
			case 'ArticleMenos':
				codiArticle = msg.data.split(' ')[2];
				Dependenta = -extreuTaula(msg);
				Botiga = extreuBotiga(msg);
				if (Incr != ' + 1') Incr = ' - 1';
				Sql = "Update TicketsTemporals ";
				Sql += "set rebut='' , quantitat = quantitat " + Incr + '  ';
				Sql += "where id in( ";
				Sql += " select top 1 id from  TicketsTemporals where Botiga = " + Botiga + " and Dependenta = " + Dependenta + "  and cd = " + codiArticle + " ";
				if (Incr == ' - 1') Sql += " and quantitat >0 ";
				Sql += ") ";
				conexion.recHit(estat[0].Valor, Sql).then(info => {
					msg.data = 'comandero Detall Taula_' + extreuTaula(msg);
					comandero(msg, estat);
				});

				break;
			case 'Imprimeix':
				Dependenta = -extreuTaula(msg);
				Botiga = extreuBotiga(msg);
				conexion.recHit(estat[0].Valor, "insert into TicketsTemporalsAccions (Id,Rebut,TmSt,Botiga,Dependenta,Quantitat,Cd,Preu,Comentari,Tipus) values (newid(),'',getdate()," + Botiga + "," + Dependenta + " ,0,0,0,'PintaComandaSerie',null)").then(info => {
					msg.data = undefined;
					comandero(msg, estat);
				});
				break;
		}
	}
}

function botGuardaFoto(msg, estat) {
	var keyboard = [];
	if (msg.data === undefined || msg.data.split(' ')[1].length == 0) {
		var Sql = "select c.codi codi,nom from clients c join paramshw w on w.codi = c.codi order by c.nom ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			var linea = [];
			for (var i = 0; i < info.rowsAffected; i++) {
				linea.push({ 'text': info.recordset[i].nom, 'callback_data': 'FotoPujada ' + info.recordset[i].codi + ' ' + msg.photo[0].file_unique_id });
				if (((i + 1) % 3) == 0) { keyboard.push(linea); linea = []; }
			}
			if (linea != []) { keyboard.push(linea); linea = []; }
			var extension = (msg.photo[0].file_unique_id).substr((msg.photo[0].file_unique_id).length - 3).toUpperCase();
			var sqlimg = `insert into archivo values ('${msg.photo[0].file_id}','${msg.photo[0].file_unique_id}', '${extension}', 'Foto TPV','application/${extension.toLowerCase()}',null,getdate(), 'Santy', 0,0 )`;
			conexion.recHit(estat[0].Valor, sqlimg).then(function (info) {
				console.log(info);
			}).catch(function (error) {
				console.log(error);
			})
			botsendMessage(msg, 'Tria una Botiga', {
				resize_keyboard: false,
				one_time_keyboard: false,
				selective: false,
				reply_markup: JSON.stringify({
					inline_keyboard: keyboard
				})
			});
		});
	} else {
		var Botiga = msg.data.split(' ')[1];
		var File = msg.data.split(' ')[2];
		botsendMessage(msg, 'Foto Guardada a la Botiga !!');
		conexion.recHit(estat[0].Valor, `update archivo set propietario = '${Botiga}' where fecha in (select max(fecha) from archivo)`).then(function (info) {
			console.log(info);
		}).catch(function (e) {
			console.log(e);
		});
	}

}

function botRespondeFoto(msg, estat) {
	var keyboard = [];
	if (msg.text == "Fotos") {
		var Sql = "select c.codi codi,nom from clients c join paramshw w on w.codi = c.codi order by c.nom ";
		conexion.recHit(estat[0].Valor, Sql).then(info => {
			var linea = [];
			for (var i = 0; i < info.rowsAffected; i++) {
				linea.push({ 'text': info.recordset[i].nom, 'callback_data': 'VerFotos ' + info.recordset[i].codi });
				if (((i + 1) % 3) == 0) { keyboard.push(linea); linea = []; }
			}
			if (linea != []) { keyboard.push(linea); linea = []; }
			botsendMessage(msg, 'Tria una Botiga', {
				resize_keyboard: false,
				one_time_keyboard: false,
				selective: false,
				reply_markup: JSON.stringify({
					inline_keyboard: keyboard
				})
			});
		});

	} else {
		var botiga = msg.data.split(' ')[1];
		console.log(botiga);
	}
}

function extreuBotiga(msg) {
	if (msg.message === undefined) return -1;
	return msg.message.reply_markup.inline_keyboard[0][0].callback_data.substring(msg.message.reply_markup.inline_keyboard[0][0].callback_data.indexOf('Botiga_') + 7, 100);
}

function extreuTaula(msg) {
	if (msg.message === undefined) return -1;
	return msg.message.reply_markup.inline_keyboard[1][0].callback_data.substring(msg.message.reply_markup.inline_keyboard[1][0].callback_data.indexOf('Taula_') + 6, 100);
}

async function getLicencia(msg, estat) {
	var data = msg.text.split(" ");
	var licencia: any = parseInt(data[1]);
	var disco = parseInt(data[2]) % 970;
	if (licencia < 100) {
		licencia = `0${licencia}`;
	} else if (licencia < 10) {
		licencia = `00${licencia}`;
	}
	const x = 3; // Numero a multiplicar el codigo final
	var tempLic: any = licencia + "" + disco.toString().substring(0, 3); // Primeros 3 digitos de licencia con los 3 primeros digitos del disco con mod
	var sumaDigitosLic: any = 0; // Suma de los digitos de la combinacion de licencia y disco
	while (tempLic > 0) {
		sumaDigitosLic += tempLic % 10;
		tempLic = Math.floor(tempLic / 10);
	}
	sumaDigitosLic %= 28;
	sumaDigitosLic = sumaDigitosLic.toString().substring(0, 2);
	let lic = "00" + licencia;
	let disc = disco.toString().substring(0, 3);
	var codigoFinal: any = sumaDigitosLic + "" + lic + "" + disc;
	codigoFinal *= x;
	codigoFinal = getCodigo(codigoFinal);
	botsendMessage(msg, codigoFinal);
}

function getCodigo(codigoFinal) {
	/*
	*   Se pasa el numero a string
	*   Se convierte en array con split
	*   Se invierte con reverse
	*   Se vuelve a juntar en un string con join 
	*/
	codigoFinal = codigoFinal.toString().split("").reverse().join("");
	var len = codigoFinal.length;
	var codigo = "";
	for (var i = 11; i > 0; i--) {
		codigo += codigoFinal[len] != undefined ? codigoFinal[len] : '0';
		len--;
	}
	return codigo;
}

async function guardarNumeroSerie(msg, estat) {
	// ns [numeroSerie] [cojo/dejo] [tienda]
	var data = msg.text.split(" ");
	var numeroSerie = data[1];
	var accion = data[2].toLowerCase();
	var tienda = data[3];
	var sql = "";
	if (accion == "cojo") {
		console.log("Cojo ordenador de la tienda");
		let getId = `(SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' AND Valor = '${numeroSerie}')`;
		let consultaTienda = `SELECT * FROM (SELECT Codi, Nom, Nif, Adresa,ROW_NUMBER() OVER (PARTITION BY Adresa ORDER BY Codi) AS RowNumber, Ciutat, Cp, LLiure, [Nom Llarg] FROM clients WHERE  Nom LIKE '%${tienda}%' AND Adresa not like '') AS a WHERE a.RowNumber = 1`;
		conexion.recHit('Fac_Hitrs', consultaTienda).then(info => {
			console.log(info);
			if (tiendaSimilar(msg, info)) {
				sql = `INSERT INTO recursosExtes (Id, Variable, Valor) values (${getId}, 'FECHA_OUT', getdate())`;
				actualizarDatos(msg, sql, info.recordset[0].Nom, getId);
			}
		})
	} else if (accion == "dejo") {
		console.log("Dejo ordenador en la tienda");
		if (await !numeroSerieExiste(numeroSerie)) {
			crearDatos(msg, numeroSerie);
		} else {
			conexion.recHit('Fac_Hitrs', `SELECT Id FROM recursosExtes WHERE Variable = 'NSERIE' AND Valor = '${numeroSerie}'`).then(info => {
				let updateDatos = `UPDATE recursosExtes SET Valor = 'El item esta en la tienda: ${tienda}' WHERE Variable = 'INFORMACION' AND Id = '${info.recordset[0].Id}'`;
				console.log(info);
				conexion.recHit('Fac_Hitrs', updateDatos).then(info => {
					botsendMessage(msg, "Datos actualizados");
				});
			});
		}
	} else {
		botsendMessage(msg, "Me has dicho mal la acción. Solo puede ser dejo o cojo.");
	}
}

async function numeroSerieExiste(numeroSerie) {
	let getNumeroSerie = `SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' AND Valor = '${numeroSerie}'`;
	conexion.recHit('Fac_Hitrs', getNumeroSerie).then(info => {
		if (info.rowsAffected >= 1) {
			// Devuelvo true si el numero de serie ya existe en la tabla
			return true;
		} else {
			// Devuelvo false si el numero de serie no existe en la tabla
			return false;
		}
	});
}

function tiendaSimilar(msg, info) {
	/* ACABAR LA FUNCION DE LA BOTONERA */
	var keyboard = [];
	var linea = [];
	if (info.rowsAffected == 0 || info.rowsAffected > 10) {
		botsendMessage(msg, "Dime un nombre de tienda más concreto");
		return false;
	} else if (info.rowsAffected == 1) {
		return true;
	} else {
		for (var i = 0; i < info.rowsAffected; i++) {
			linea.push({ 'text': info.recordset[i].Nom, 'callback_data': 'NumeroSerieBoton | ' + info.recordset[i].Nom });
			if (((i + 1) % 2) == 0) { keyboard.push(linea); linea = []; }
		}
		if (linea != []) { keyboard.push(linea); linea = []; }
		botsendMessage(msg, 'Escoge una tienda', {
			resize_keyboard: false,
			one_time_keyboard: false,
			selective: false,
			reply_markup: JSON.stringify({
				inline_keyboard: keyboard
			})
		});
	}
}

function actualizarDatos(msg, sql, tienda, getId) {
	let infoTienda = `INSERT INTO recursosExtes (Id, Variable, Valor) values (${getId}, 'INFORMACION', 'El item ya no está en esta tienda: ${tienda}')`;
	conexion.recHit('Fac_Hitrs', sql).then(info => {
		conexion.recHit('Fac_Hitrs', infoTienda).then(() => {
			botsendMessage(msg, "Datos actualizados para la tienda: " + tienda);
		})
	});
}

async function actualizarDatosBoton(msg, estat) {
	console.log(msg);
	var data = msg.data.split(" | ");
	var tienda = data[1];
	console.log(tienda);
}

function mandarDatosChronos(msg, datos, empresa) {
	if (empresa == 'Fac_Jorba') {
		let sql = `INSERT INTO ImpresoraCola (id, Impresora, descripcio, Texte, TmStPeticio) VALUES (newid(), 'telegram_jorba', 'Chronos', '${datos}', getdate())`;
		conexion.recHit('hit', sql).then(info => {
			botsendMessage(msg, "Imprimint...");
		});
	} else {
		botsendMessage(msg, "Impresora no configurada");
	}

	//botsendMessage(msg, datos, {'parse_mode': 'HTML'});
}
//insertarFeinesAFer(estat[0].Valor, equip, today);
function insertarFeinesAFer(msg, empresa, equip, masa, fecha) {
	var nuevaFecha = fecha.getDate() + "/" + fecha.getMonth() + 1 + "/" + fecha.getFullYear();
	if (empresa == 'Fac_Jorba') {
		let sql = `INSERT INTO FeinesAFer (id, tipus, ciclica, param1, param2, param3) VALUES (NEWID(), 'ProduccionEquipoMasa', 0, '${nuevaFecha}', 'Totes', '${equip}')`;
		//insert into FeinesAFer (id, tipus, ciclica, param1, param2, param3) values (NEWID(), 'ProduccionEquipoMasa', 0, '14/01/2021', 'Totes', 'Equipo')
		conexion.recHit(empresa, sql).then(() => {
			botsendMessage(msg, "Imprimiendo...");
		});
	} else {
		botsendMessage(msg, "Función no disponible");
	}
}
function cambiarFormatoFecha(fecha, off) {
	let diasMeses = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	var fechaArray = fecha.split("/").join(" ").split(" ");
	var dia: any = parseInt(fechaArray[2]);
	var mes: any = parseInt(fechaArray[1]);
	var ano = parseInt(fechaArray[0]);
	if (ano % 400 == 0 || (ano % 100 != 0 && ano % 4 == 0)) {
		diasMeses[1] = 29;
	}
	if (dia + off == 32 && mes == 12) {
		mes = 1;
		dia = 1;
		ano += 1;
	} else {
		if (dia + off == diasMeses[mes - 1] + 1) {
			mes += 1;
			dia = 1;
		} else if (dia + off == 0) {
			mes -= 1;
			dia = diasMeses[mes - 1];
		} else {
			dia = parseInt(dia) + off;
		}
	}
	dia = (dia < 10) ? "0" + dia : dia;
	mes = (mes < 10) ? "0" + mes : mes;
	var nuevaFecha = dia + '/' + mes + '/' + ano;
	return nuevaFecha;
}


function crearDatos(msg, numeroSerie) {
	/*
	COGER VARIABLES
		DIRECCION -> SELECT Adresa FROM clients WHERE nom = (SELECT Nombre FROM recursos WHERE id = (SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = {numeroSerie}))
		DESCRIPCION -> SELECT nombre FROM ccMateriasPrimas WHERE id = (SELECT matPrima FROM ccRecepcion WHERE lote = {numeroSerie})
		NSERIE -> {numeroSerie}
		NPEDIDO -> preguntar el lunes
		CLIENTE -> SELECT Codi FROM clients WHERE nom = (SELECT Nombre FROM recursos WHERE id = (SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = {numeroSerie}))
		TELEFONOS -> SELECT Telefon FROM ClientsFinals WHERE Nom = (SELECT Nombre FROM recursos WHERE id = (SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = {numeroSerie}))
	*/
	var direccion = `(SELECT Adresa FROM clients WHERE nom = (SELECT Nombre FROM recursos WHERE id = (SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = '${numeroSerie}')))`;
	var descripcion = `(SELECT nombre FROM ccMateriasPrimas WHERE id = (SELECT matPrima FROM ccRecepcion WHERE lote = '${numeroSerie}'))`;
	var cliente = `(SELECT Codi FROM clients WHERE nom = (SELECT Nombre FROM recursos WHERE id = (SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = '${numeroSerie}')))`;
	var telefono = `(SELECT Telefon FROM ClientsFinals WHERE Nom = (SELECT Nombre FROM recursos WHERE id = (SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = '${numeroSerie}')))`;
	conexion.recHit('Fac_Hitrs', `INSERT INTO recursosExtes VALUES (newid(), 'NSERIE', '${numeroSerie}')`).then(info => {
		let id = `(SELECT id FROM recursosExtes WHERE Variable = 'NSERIE' and Valor = '${numeroSerie}')`;
		var sql = `INSERT INTO recursosExtes VALUES (${id}, 'DESCRIPCION', ${descripcion}), (${id}, 'CLIENTE', ${cliente}), (${id}, 'DIRECCION', ${direccion}), (${id}, 'TELEFONOS', ${telefono})`;
		conexion.recHit('Fac_Hitrs', sql).then(info => {
			botsendMessage(msg, "Datos creados para este pedido");
		})
	})
}


bot.onText(/^\/menu/, function (msg) {
	botsendMessage(msg, "Hola, " + msg.from.username + " Aqui Tens el menu...");
});

bot.on('callback_query', function (msg) {
	mainBot(msg);
	//	if (nombresDeDios.indexOf(msg.from.id)<0) 	bot.sendMessage('911219941', msg.from.first_name + " Diu : " + msg.data);  // me lo mando a mi pa verlo to....	
});

bot.on('polling_error', function (error) {
	//    console.log(error);
});

bot.onText(/./, function (msg) {
	console.log(msg.from.first_name + "--->" + msg.text);
	if (nombresDeDios.indexOf(msg.from.id) < 0) 	// ESTA LINEA GENERA ERROR, LA COMENTO - bot.sendMessage('911219941', msg.from.first_name + " Diu : " + msg.text);  // me lo mando a mi pa verlo to....	
		if (msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
			if (msg.text == 'BotoFicha') bot.sendMessage(msg.chat.id, 'Actualitza la meva ficha', { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: 'Actualitza Ficha', 'callback_data': 'Fichar Edit Propia' }]], hide_keyboard: false, resize_keyboard: true, one_time_keyboard: true, }), });
			if (msg.text.indexOf('cul') >= 0) bot.deleteMessage(msg.chat.id, msg.message_id);
			//bot.getChatMember(msg.chat.id, msg.from.id).then(function (res) {	console.log(res); });
			if (msg.data == 'Fichar Edit') mainBot(msg);
			if (msg.text.indexOf('@') >= 0) bot.sendMessage(msg.chat.id, msg.from.first_name + " Diu : " + msg.text + " (me lo apunto)");  // me lo mando a mi pa verlo to....
		} else {
			mainBot(msg);
		}

});

bot.on("contact", (msg) => {
	bot.sendMessage('911219941', msg.from.first_name + " Envia contacte : " + msg.contact.phone_number);  // me lo mando a mi pa verlo to....	
	console.log(msg.contact.first_name);
	console.log(msg.contact.phone_number);
	buscaId(msg);
});

bot.on('location', (msg) => {
	//bot.sendMessage('911219941', msg.from.first_name + " Envia Posicio");  // me lo mando a mi pa verlo to....	

	if (msg.venue === undefined) {
		msg.data = 'Fichar Ficha'
		mainBot(msg)
		var lat = msg.location.latitude;
		var lon = msg.location.longitude;
		bot.sendMessage(msg.from.id, 'has fixat desde  ' + lat + ',' + lon);
	}
	else {
		bot.sendMessage(msg.from.id, 'Per fixar envia la teva ubicació ');
	}
});

export { botsendMessage, bot, mainBot }