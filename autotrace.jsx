#target illustrator

// オートトレースする元画像のサイズ
var pageWidth = 1920;
var pageHeight = 1080;

// オートトレースする元画像の拡張子
var targetPattern = '*.png';

/**
 * hoge.pngから、hogeを得る
 */
function basename(str) {
    return str.replace(/\.[A-Za-z0-9]+$/, '');
}

/**
 * targetFileから拡張子を取り除いて.aiをくっつける
 */
function getSaveFile(targetFile) {
    var saveFileName = basename(targetFile) + '.ai';
    return new File(saveFileName);
}

/**
 * 処理本体
 */
function myTrace(targetFile) {
    // からっぽの下地を新規作成
    var myDoc = app.documents.add(DocumentColorSpace.RGB, pageWidth, pageHeight);

    // 配置するファイル
    var myFile = File(targetFile);

    // 画像を配置
    var myItem = myDoc.placedItems.add();
    myItem.file = myFile;

    // ライブトレース
    var myTrace = myItem.trace();
    // ライブトレースのオプション
    with (myTrace.tracing.tracingOptions) {
        ///// 調整
        // カラーモード
        tracingMode = TracingModeType.TRACINGMODEBLACKANDWHITE;
        // しきい値
        threshold = 128;
        // ぼかし
        preprocessBlur = 0;
        // 再サンプル
        resample = true;
        
        ///// トレースの設定
        // 塗り
        fills = true;
        // 線
        strokes = true;
        // 誤差の許容値
        pathFitting = 1;
        // 最小エリア
        minArea = 0.1;
        // コーナー角度
        cornerAngle = 0;

	// ホワイトを無視
	ignoreWhite = true;
        
        ///// 表示
        // ラスタライズ
        viewRaster = ViewRasterType.TRACINGVIEWRASTERTRANSPARENTIMAGE;
        // ベクトル
        viewVector = ViewVectorType.TRACINGVIEWVECTOROUTLINESWITHTRACING;

        livePaintOutput = false;
    }
    //redraw();

    // ライブペイント
    myTrace.tracing.expandTracing();
    with (myTrace.tracing.tracingOptions) {
        livePaintOutput = true;
    }
    //redraw();

    // ファイル保存
    myDoc.saveAs(getSaveFile(targetFile));
    myDoc.close(SaveOptions.DONOTSAVECHANGES);
    
    myDoc = null;
    myFile = null;
    myItem = null;
    myTrace = null;
}

/////
///// ここから処理スタート
/////

// フォルダ選択ダイアログ
var targetFolder = Folder.selectDialog("フォルダを選択してください");
var targetFiles = targetFolder.getFiles(targetPattern);

// フォルダにあるファイルを処理
if (targetFiles.length > 0) {
    for (var i = 0; i < targetFiles.length; i++) {
        myTrace(targetFolder + '/' + targetFiles[i].name);
    }
    alert(i + ' files processed.');
} else {
    alert('No files to trace!');
}
