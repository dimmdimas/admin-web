import WidgetKit
import SwiftUI

// 1. Model Data dari API Anda
struct MonitoringEntry: TimelineEntry {
    let date: Date
    let hadir: Int
    let tidakIkut: Int
    let belumAbsen: Int
}

// 2. Logika Fetch API
struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> MonitoringEntry {
        MonitoringEntry(date: Date(), hadir: 45, tidakIkut: 5, belumAbsen: 80)
    }

    func getSnapshot(in context: Context, completion: @escaping (MonitoringEntry) -> ()) {
        let entry = MonitoringEntry(date: Date(), hadir: 45, tidakIkut: 5, belumAbsen: 80)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // GANTI URL INI DENGAN API ANDA
        let url = URL(string: "https://api.muhdimas.my.id/api/widget-summary/day1")!
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            var hadir = 0
            var tidakIkut = 0
            var belumAbsen = 0
            
            if let data = data {
                if let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    hadir = json["hadir"] as? Int ?? 0
                    tidakIkut = json["tidakIkut"] as? Int ?? 0
                    belumAbsen = json["belumAbsen"] as? Int ?? 0
                }
            }
            
            let entry = MonitoringEntry(date: Date(), hadir: hadir, tidakIkut: tidakIkut, belumAbsen: belumAbsen)
            
            // Jadwalkan widget untuk refresh otomatis setiap 15 Menit
            let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
            let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
            completion(timeline)
        }
        task.resume()
    }
}

// 3. Tampilan Visual Widget (UI)
struct MonitoringWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Day 1 - Lembur")
                .font(.system(size: 16, weight: .black, design: .rounded))
                .foregroundColor(.blue)
            
            Divider()
            
            HStack {
                Text("✅ Hadir:")
                    .font(.system(size: 14, weight: .medium))
                Spacer()
                Text("\(entry.hadir)")
                    .font(.system(size: 16, weight: .bold))
            }
            HStack {
                Text("❌ Libur:")
                    .font(.system(size: 14, weight: .medium))
                Spacer()
                Text("\(entry.tidakIkut)")
                    .font(.system(size: 16, weight: .bold))
            }
            HStack {
                Text("⏳ Belum:")
                    .font(.system(size: 14, weight: .medium))
                Spacer()
                Text("\(entry.belumAbsen)")
                    .font(.system(size: 16, weight: .bold))
            }
        }
        // Background khusus untuk iOS 17 ke atas
        .containerBackground(Color.white, for: .widget) 
    }
}

// 4. Registrasi Widget ke Sistem iOS
@main
struct MonitoringWidget: Widget {
    let kind: String = "MonitoringWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MonitoringWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Monitoring Absen")
        .description("Pantau data karyawan lembur.")
        .supportedFamilies([.systemSmall]) // Hanya pakai ukuran kecil (2x2)
    }
}